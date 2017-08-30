import Models from "../../models/models";
import IdentityService from "../../services/IdentityService";
import UserService from "../../services/userService";
import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";
import { IWsElementParams } from "./wsElementParams";

export default class WsElementBase extends ComponentBase {

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            params: "<",
        };
    }

    /**
     * Element共通パラメーター
     */
    public params: IWsElementParams;

    /**
     * BindingされたWsElement
     */
    public get element(): Models.Dtos.WsElementDto {
        return this.params.element;
    }

    /**
     * WSのOwner UserId
     */
    public get ownerUserId(): DtoIdType {
        return this.params.ownerUserId;
    }

    /**
     * 現在ログイン中のユーザー
     */
    public get currentUser(): Models.Dtos.UserDto {
        // currentUserが指定されていなければ、現在ログイン中のユーザーを取得する
        return this.params.currentUser || this.identityService.currentUser;
    }

    public get editMode(): boolean {
        return this.params.editMode;
    }

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, UserService.IID, IdentityService.IID, "$scope"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public userService: UserService,
        public identityService: IdentityService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        this.onLoad();
        this.$scope.$watch(() => this.params.ownerUserId, () => {
            this.onLoad();
            this.validate();
        });
        this.$scope.$watch(() => this.params.element.wsElementId, () => {
            this.onLoad();
            this.validate();
        });
        // ws:loadイベントリスナを登録する
        this.$scope.$on("ws:load", (event: ng.IAngularEvent, args) => {
            this.onLoad();
        });
    }

    protected registerSaveEvent() {
        // element:saveイベントリスナを登録する
        this.$scope.$on("ws:save", (event: ng.IAngularEvent, args) => {
            if (this.isValid() && this.isDirty()) {
                this.onElementSave();
            }
        });

        // element:validateイベントリスナを登録する
        this.$scope.$on("element:validate:" + this.element.wsElementId, (event: ng.IAngularEvent) => {
            if (!this.params.editMode) {
                if (!this.isValid()) {
                    // this.wsAssignmentService.setValid(this.params.element, false);
                    this.params.isValid = false;
                }
                if (this.isDirty()) {
                    // this.wsAssignmentService.setDirty(this.params.element, true);
                    this.params.isDirty = true;
                }
            }
        });

        // ws:validateイベントリスナを登録する
        this.$scope.$on("ws:checkDirty", (event: ng.IAngularEvent) => {
            if (this.params.isDirty) {
                this.wsAssignmentService.setDirty();
            }
        });
    }

    /**
     * element:saveイベントを発生させ、すべてのelementコンポーネントを保存する。
     */
    // public save() {
    //     this.wsAssignmentService.save(this.$scope);
    //     // if (this.$scope.$root) {
    //     //     this.$scope.$root.$broadcast("element:save:" + this.element.wsElementId);
    //     // }
    // }

    /**
     * element:validateイベントを発生させ、すべてのelementコンポーネントのvalidationを行う
     */
    public validate() {
        if (this.$scope.$root) {
            this.params.isDirty = false;
            this.params.isValid = true;
            this.$scope.$root.$broadcast("element:validate:" + this.element.wsElementId);
            this.wsAssignmentService.checkDirty(this.$scope);
        }
    }

    /**
     * elementが入力済で、保存可能状態(validated)かどうかを取得する
     */
    // public get isReadyToSave(): boolean {
    //     return this.editMode ? false : this.wsAssignmentService.isReadyToSave(this.element);
    // }

    /**
     * element:save イベントリスナー
     * isValid = false ならば呼ばれない
     */
    protected onElementSave() {
        return;
    }

    /**
     * elementが保存可能状態かどうかを返す
     * オーバーライドすること
     */
    protected isValid(): boolean {
        return true;
    }

    /**
     * elementが保存可能状態かどうかを返す
     * オーバーライドすること
     */
    protected isDirty(): boolean {
        return false;
    }

    /**
     * データ初期化処理を記述
     * ownerUserIdをwatchしており、変更時に自動的に呼び出される。
     */
    protected onLoad(): void {
        return;
    }

    /**
     * entries連想配列に、authorをキーとしてentryを追加する
     */
    protected addEntryByAuthor(
        entries: WsEntry.IEntryCollection,
        entryType: Models.Worksheet.WsEntryTypeEnum,
        isSingleValue = false,
    ) {
        this.getEntries(entryType).forEach((entry) => {
            // entryが表示対象かどうかを示す
            if (this.wsAssignmentService.CheckEntryEnable(entry, this.params.ownerUserId, isSingleValue)) {
                // entriesにauthorのkeyが存在しない場合は、空の配列を作成する
                if (!(entry.createUserId in entries)) {
                    entries[entry.createUserId] = [];
                }
                // すでに存在しない場合は、entryを追加する
                if (!(entries[entry.createUserId].find((value) => value.id === entry.id))) {
                    entries[entry.createUserId].push(entry);
                }
            }
        });
    }

    /**
     * Element.Contentを取得
     */
    public get content(): Models.Dtos.WsElementContentDto {
        return this.params.element.content || null;
    }

    /**
     * Element.Propertyを取得
     */
    public get property() {
        return this.params.element.property;
    }

    /**
     * 入力必須かどうか
     * contentが存在しない／入力不可の場合はfalse
     */
    public get isRequired() {
        return this.wsAssignmentService.elementIsRequired(this.params.element);
    }

    /**
     * Entry配列をTypeを指定して取得する
     * @param entryType
     */
    protected getEntries(entryType: Models.Worksheet.WsEntryTypeEnum): WsEntry.EntryArray {
        return this.wsAssignmentService.getEntryArray(this.params.element, entryType);
    }

    /**
     * 現在ログイン中ユーザーのEntryのうち最新の値を取得する
     * @param entryType
     */
    protected getMySingleEntry(entryType: Models.Worksheet.WsEntryTypeEnum): Models.Dtos.WsEntryDto {
        return this.wsAssignmentService.getSingleEntry(
            this.params.element, entryType, this.params.ownerUserId, this.currentUser.id);
    }

    protected getEntriesByAuthor(userId: DtoIdType): WsEntry.EntryArray {
        return this.wsAssignmentService.getEntriesByAuthor(this.params.element, this.params.ownerUserId)[userId];
    }
    /**
     * ElementのAccess Level
     */
    public get accessLevel() {
        return this.wsAssignmentService.getAccessPermission(
            this.params.element, this.params.ownerUserId, this.currentUser);
    }

    /**
     * userIdからUserオブジェクト(DisplayUserDto)を取得する
     * @param userId
     */
    public getUser(userId: DtoIdType): Models.Dtos.DisplayUserDto {
        return this.userService.getUser(userId);
    }

    /**
     * userIdからユーザー名を取得する
     * @param userId
     */
    public getDisplayName(userId: DtoIdType): string {
        return this.userService.getDisplayName(userId);
    }

}
