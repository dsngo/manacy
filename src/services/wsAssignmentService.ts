import * as _ from "lodash";
import * as restangular from "restangular";
import Models from "../models/models";
import IdentityService from "./IdentityService";
import ServiceBase from "./serviceBase";
import UserService from "./userService";

// declare global {
//     const WsAssignmentServiceIID = "wsAssignmentService";
// }

export default class WsAssignmentService extends ServiceBase {
    /**
     * 登録サービス名
     */
    public static readonly IID = "wsAssignmentService";

    /**
     * インジェクトするサービス
     */
    private static $inject = ["Restangular", "$q", IdentityService.IID, UserService.IID];

    /**
     * コンストラクタ
     */
    public constructor(
        protected Restangular: restangular.IService,
        protected $q: ng.IQService,
        protected identityService: IdentityService,
        protected userService: UserService,
    ) {
        super();
    }

    /**
     * 配付オブジェクト
     */
    public assignment: Models.Dtos.WsAssignmentDto = null;

    /**
     * Wsオブジェクト
     */
    public ws: Models.Dtos.WsDto = null;

    public directories: Models.Dtos.DirectoryDto[] = null;

    /**
     * WsElement（配列）
     */
    private elementArray: Models.Dtos.WsElementDto[] = null;
    /**
     * WsElementIdをキーとして、elementsを取得するための連想配列
     */
    private elementsBy: { [key: string]: Models.Dtos.WsElementDto } = {};
    /**
     * WsElementIdをキーとして、elementsを取得するための連想配列を返す
     */
    public get elements() {
        return this.elementsBy;
    }

    /**
     * elementが保存されていない入力値を持ち、保存可能状態にあるかを保持するフラグ連想配列
     */
    // private elementsIsValid: { [wsElementId: string]: boolean } = {};
    // private elementsIsDirty: { [wsElementId: string]: boolean } = {};
    // tslint:disable-next-line:variable-name
    private _isDirty: boolean = false;

    /**
     * elementが保存されていない入力値を持ち、保存可能状態にあるか
     */
    // public isReadyToSave(element: Models.Dtos.WsElementDto): boolean {
    //     return this.isValid(element) && this.isDirty(element);
    //     // if (element.wsElementId in this.elementsIsValid && element.wsElementId in this.elementsIsDirty) {
    //     //     return this.elementsIsValid[element.wsElementId] && this.elementsIsDirty[element.wsElementId];
    //     // } else {
    //     //     return false;
    //     // }
    // }

    // public setValid(element: Models.Dtos.WsElementDto, valid: boolean = true) {
    //     this.elementsIsValid[element.wsElementId] = valid;
    // }

    // public isValid(element: Models.Dtos.WsElementDto) {
    //     return element.wsElementId in this.elementsIsValid ? this.elementsIsValid[element.wsElementId] : true;
    // }

    public setDirty() {
        this._isDirty = true;
        //     this.elementsIsDirty[element.wsElementId] = dirty;
    }

    // public get isDirty() {
    //     return this._isDirty;
    //     // return element.wsElementId in this.elementsIsDirty ? this.elementsIsDirty[element.wsElementId] : false;
    // }

    public checkDirty($scope: ng.IScope) {
        if ($scope.$root) {
            // this.elementsIsDirty = {};
            // this.elementsIsValid = {};
            this._isDirty = false;
            $scope.$root.$broadcast("ws:checkDirty");
        }
    }

    public save($scope: ng.IScope) {
        if ($scope.$root) {
            $scope.$root.$broadcast("ws:save");
        }
    }

    /**
     * ws:loadイベントをbroadcastし、全コンポーネントを更新する
     * @param
     */
    public reLoad($scope: ng.IScope) {
        if ($scope.$root) {
            $scope.$root.$broadcast("ws:load");
        }
    }

    public get isDirty(): boolean {
        return this._isDirty;
        // return this.elementArray.some((elm) => {
        //     return this.isValid(elm) && this.isDirty(elm);
        // });
    }

    // private elementIds = [];
    // private elementIdMap: { [WsElementId: string]: number } = {}

    /**
     * WsEntry（配列）
     */
    private entryArray: Models.Dtos.WsEntryDto[] = null;
    private entriesBy = {};
    private latestEntries = {};
    private entriesByAuthor = {};

    /**
     * ワークシートグループメンバー
     */
    private groupMemberArray: Models.Dtos.WsGroupMemberDto[];
    private groups: Ws.IUserGroups = {};
    private myGroups: Ws.IUserGroups = {};
    private myGroupMembers: { [userId: string]: string[] } = {};

    /**
     * ファイル情報
     */
    private blobDataList: Models.Dtos.BlobUrlDto[];

    public get userGroups() {
        return this.groups;
    }
    public get myUserGroups() {
        return this.myGroups;
    }

    /**
     * 指定されたユーザーが自分と同じグループに所属しているかどうか
     * @param userId
     */
    public CheckIfMyGroupMember(userId: DtoIdType): boolean {
        if (userId === UserService.DummyStudentSameGroup.id) {
            return true;
        }
        return this.myGroupMembers[userId] != null;
    }

    /**
     * データ読み込み済かどうか
     */
    public get isLoaded(): boolean {
        return this.elementArray && !this.isBusy;
    }

    /**
     * データ読み込み
     * @param assignmentId
     */
    public load(assignmentId: number): ng.IPromise<WsAssignmentService> {
        this.busy(true);

        const assignmentElement = this.Restangular.one("assignments", assignmentId);

        const assignmentPromise = this.Restangular
            .one("assignments", assignmentId)
            .get<Models.Dtos.WsAssignmentDto>();

        const wsPromise = assignmentPromise.then((assignment) => {
            return this.Restangular
                .one("ws", assignment.wsElementId)
                .get<Models.Dtos.WsDto>();
        });

        const elementsPromise = assignmentPromise.then((assignment) => {
            return this.Restangular
                .one("ws", assignment.wsElementId)
                .all("elements")
                .getList<Models.Dtos.WsElementDto>();
        });

        const entriesPromise = assignmentElement
            .all("entries")
            .getList<Models.Dtos.WsEntryDto>();

        const groupsPromise = assignmentElement
            .all("groups")
            .getList<Models.Dtos.WsGroupMemberDto>();

        const usersPromise = assignmentElement
            .all("users")
            .getList<Models.Dtos.DisplayUserDto>();

        return this.$q
            .all([assignmentPromise, wsPromise, elementsPromise, entriesPromise, groupsPromise, usersPromise])
            .then((values) => {
                this.assignment = values[0];
                this.ws = values[1];
                this.elementArray = values[2];
                this.entryArray = values[3];
                this.groupMemberArray = values[4];
                this.userService.loadUsers(values[5]);
                this.InitiallizeData();
                return this;
            })
            .finally(() => this.busy(false));
    }

    /**
     * Element配列関連データの初期化
     */
    private InitiallizeData(): void {

        // //ElementIdの配列を作成
        // this.elementIds = this.elements.map(
        //     (value, index, array) => {
        //         return value.wsElementId
        //     });

        // ElementId値からelements配列のIndexを引く配列を作成
        // this.elementIdMap = this.elements.reduce(
        //     (prev, curr, index, array) => {
        //         prev[curr.wsElementId] = index;
        //         return prev;
        //     }, {});

        // ------------------------
        // Elementの初期化
        // ------------------------
        // callback中のthisを保持するためにLocal Fat Arrowを使う
        // https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript
        this.elementsBy = {};
        this.elementArray.forEach((element) => this.initElement(element));

        // this.elementIdMap = _.keyBy(this.elementIds, (e)=>{return e});

        // ------------------------
        // Entryの初期化
        // ------------------------
        // callback中のthisを保持するためにLocal Fat Arrowを使う
        // https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript
        this.latestEntries = {};
        this.entriesBy = {};
        this.entriesByAuthor = {};
        this.entryArray.forEach((entry) => this.initEntry(entry));

        // //Indexを作成
        // this.entriesBy = _
        //     .chain(this.entryArray)
        //     .groupBy("wsElementId")
        //     .mapValues((value: Models.Dtos.WsEntryDto[]) => {
        //         return _.groupBy(value, "wsEntryTypeId")
        //     })
        //     .value();

        // this.entriesByAuthor =
        //     _.mapValues(this.entriesBy, (byType) => {
        //         return _.mapValues(byType, (array: WsEntry.EntryArray) => {
        //             return _
        //                 .chain(array)
        //                 .groupBy('ownerUserId')
        //                 .mapValues((array2: WsEntry.EntryArray) => {
        //                     return _.groupBy(array2, 'createUserId');
        //                 })
        //                 .value();
        //         });
        //     });

        // Group Data

        // グループごとのユーザー一覧
        this.groups = _(this.groupMemberArray)
            .map((v) => Object({groupName: v.groupName, user: this.userService.getUser(v.userId)}))
            .groupBy("groupName")
            .mapValues((values: any[]) => values.map((v) => v.user))
            .value();

        // グループが存在しない(""グループのみ)場合はグループ名をUIで付ける
        if (this.groups[""]) {
            // tslint:disable-next-line:no-string-literal
            this.groups["グループ未設定"] = this.groups[""];
            delete this.groups[""];
        }

        // 現在ログインユーザーが所属するグループ
        this.myGroups = _.pickBy(this.groups, (value: Models.Dtos.DisplayUserDto[]) => {
            return _.some(value, (value2, index2, array2) => {
                return value2.id === this.identityService.currentUser.id;
            });
        }) as Ws.IUserGroups;

        // 現在ログインユーザーと同じグループに所属するユーザー
        _.forEach(this.myGroups, (group, groupName) => {
            group.forEach((member) => {
                this.myGroupMembers[member.id] = this.myGroupMembers[member.id] || [];
                this.myGroupMembers[member.id].push(groupName);
            });
        });
    }

    /**
     * Elementを初期化する
     * @param element
     */
    public initElement(element: Models.Dtos.WsElementDto) {
        // Element.Contentをparse
        if (element.content) {
            if (!_.isObject(element.content.entrySettings)) {
                element.content.entrySettings
                    = JSON.parse(element.content.entrySettings as string);
            }
        } else {
            element.content = {
                id: undefined,
                wsElementId: element.wsElementId,
                title: "",
                description: "",
                entryStatus: Models.Worksheet.WsEntryStatusEnum.Disabled,
                entrySettings: {},
                createDate: undefined,
                createUserId: undefined,
            };
        }

        // Indexを作成
        this.elementsBy[element.wsElementId] = element;
    }

    /**
     * Elementを追加する
     * @param element 追加するelement
     */
    public addElement(element: Models.Dtos.WsElementDto) {
        this.initElement(element);
        this.elementArray.push(element);
    }

    public deleteElement(id: DtoIdType) {
        _.remove(this.elementArray, ((elm) => {
            return elm.wsElementId === id;
        }));
        delete this.elementsBy[id];

    }

    /**
     * RootElementを取得する
     */
    public get rootElement(): Models.Dtos.WsElementDto {
        return this.elementsBy[this.ws.wsElementId];
    }

    /**
     * Elementの子ElementのIDの配列を取得する
     * @param wsElementId
     */
    public getChildElements(element: Models.Dtos.WsElementDto): Models.Dtos.WsElementDto[] {
        return this.elementArray.filter(
            (value, index, array) => {
                return value.property.parentId === element.wsElementId;
            },
        );
    }

    /**
     * Elementのアクセスレベルを取得する
     * @param wsElementId
     * @param ownerId
     */
    public getAccessPermission(
        element: Models.Dtos.WsElementDto,
        ownerId: DtoIdType,
        currentUser: Models.Dtos.DisplayUserDto,
    ): Models.AccessPermissionEnum {

        // 現在ログイン中のユーザーが教師の場合
        if (currentUser.teacher) {
            if (ownerId === currentUser.id) {
                return element.property.accessLevel.teacherOwner;

            } else if (this.CheckIfMyGroupMember(ownerId)) {
                // 同じグループの他の生徒のワークシートの場合
                return element.property.accessLevel.teacherGroup;

            } else {
                // 同じグループでない生徒のワークシートの場合
                return element.property.accessLevel.teacherCourse;
            }
        } else if (currentUser.student) {
            // 現在ログイン中のユーザーが生徒の場合
            if (ownerId === currentUser.id) {
                return element.property.accessLevel.studentOwner;

            } else if (this.CheckIfMyGroupMember(ownerId)) {
                // 同じグループの他の生徒のワークシートの場合
                return element.property.accessLevel.studentGroup;

            } else {
                // 同じグループでない生徒のワークシートの場合
                return element.property.accessLevel.studentCourse;
            }
        }
    }

    /**
     * Entryを初期化
     * @param entry
     */
    private initEntry(entry: Models.Dtos.WsEntryDto) {
        // JsonDataをparse
        entry.jsonData = entry.jsonData ? JSON.parse(entry.jsonData as string) : null;

        // latestEntriesを更新
        _.update(
            this.latestEntries,
            [entry.wsElementId, entry.wsEntryTypeId, entry.ownerUserId, entry.createUserId],
            (value: Models.Dtos.WsEntryDto) => {
                if (value && value.id > entry.id) {
                    return value;
                }
                return entry;
            });

        // entriesByを更新
        _.update(
            this.entriesBy,
            [entry.wsElementId, entry.wsEntryTypeId],
            (targetArray: WsEntry.EntryArray) => {
                if (!targetArray) {
                    targetArray = [];
                }
                targetArray.push(entry);
                return targetArray;
            });

        // entriesByAuthorを更新
        _.update(
            this.entriesByAuthor,
            [entry.wsElementId, entry.ownerUserId, entry.createUserId],
            (targetArray: WsEntry.EntryArray) => {
                if (!targetArray) {
                    targetArray = [];
                }
                targetArray.push(entry);
                return targetArray;
            });

    }

    /**
     * 同じユーザーが同じownerのWSに書き込んだEntryの中で、最も新しいものを取得する
     * @param wsElementId
     * @param entryTypeId
     * @param ownerUserId
     * @param createUserId
     */
    public getSingleEntry(
        element: Models.Dtos.WsElementDto,
        entryTypeId: Models.Worksheet.WsEntryTypeEnum,
        ownerUserId: DtoIdType,
        createUserId: DtoIdType,
    ): Models.Dtos.WsEntryDto {
        return _.get(
            this.latestEntries, [element.property.entryTargetId, entryTypeId, ownerUserId, createUserId], null);
    }

    /**
     * Author(CreateUser)ごとのentry配列を取得する
     * entryが存在しない場合は{}を返す
     * @param element
     * @param entryTypeId
     * @param ownerUserId
     */
    public getEntriesByAuthor(
        element: Models.Dtos.WsElementDto,
        ownerUserId: DtoIdType,
    ): WsEntry.IEntryCollection {
        return _.get(
            this.entriesByAuthor, [element.property.entryTargetId, ownerUserId], {});
    }

    /**
     * Entryの配列を取得する
     * @param element
     * @param entryTypeId
     */
    public getEntryArray(
        element: Models.Dtos.WsElementDto,
        entryTypeId: Models.Worksheet.WsEntryTypeEnum,
    ): WsEntry.EntryArray {
        return _.get(this.entriesBy, [element.property.entryTargetId, entryTypeId], []);
    }

    /**
     * Entryを表示させるかどうかを判定する
     * @param entry
     * @param ownerUserId
     * @param isSingleValue
     */
    public CheckEntryEnable(
        entry: Models.Dtos.WsEntryDto,
        ownerUserId: DtoIdType,
        isSingleValue: boolean = false,
    ): boolean {
        const element = this.elementsBy[entry.wsElementId];

        switch (element.property.shareLevel) {
            // ワークシート要素が各生徒独立の場合
            case Models.Worksheet.WsElementShareLevelEnum.Individual:
                if (entry.ownerUserId !== ownerUserId) { return false; }
                break;

            // ワークシート要素がグループ共有の場合
            case Models.Worksheet.WsElementShareLevelEnum.Group:
                if (!this.CheckIfMyGroupMember(entry.ownerUserId)) { return false; }
                break;

            // ワークシート要素がコース共有の場合
            case Models.Worksheet.WsElementShareLevelEnum.Course:
            default:
        }

        // SingleValue Entryの場合、最新のEntryでなければfalse
        if (isSingleValue) {
            const latestEntry =
                this.getSingleEntry(element, entry.wsEntryTypeId, entry.ownerUserId, entry.createUserId);
            if (latestEntry && latestEntry.id !== entry.id) { return false; }
        }

        return true;
    }

    /**
     * 入力必須かどうか
     * contentが存在しない／入力不可の場合はfalse
     */
    public elementIsRequired(element: Models.Dtos.WsElementDto) {
        return element.content ?
            element.content.entryStatus === Models.Worksheet.WsEntryStatusEnum.Required : false;
    }

    /**
     * 当該elementがValid（入力が要求されており、かつ入力済）であるかどうかを判定する
     * 入力必須でない、またそもそも入力不可の場合はtrue(valid)を返す。
     * @param element 対象element
     * @param ownerId 表示中WSのOwner
     * @param currentUser 対象ユーザー（省略可）
     */
    public elementIsValid(element: Models.Dtos.WsElementDto, ownerId: DtoIdType, currentUser: Models.Dtos.DisplayUserDto = null): boolean {
        if (!this.elementIsRequired(element)) {
            // 入力必須でなければ、常にtrue (valid)
            return true;
        }
        if (currentUser === null) {
            currentUser = this.identityService.currentUser;
        }
        if (this.getAccessPermission(element, ownerId, currentUser) === Models.AccessPermissionEnum.ReadWrite) {
            return currentUser.id in this.getEntriesByAuthor(element, ownerId);
        } else {
            // 書込可能でなければ、常にtrue (valid)
            return true;
        }
    }

    /**
     * Entryをサーバーに送信し、保存する
     * entryをpostし、保存されたらその結果をwsAssignmentServiceのEntry配列にも追加する。
     * @param element 対象element
     * @param params Entryを保存する際に必要な情報をもつDTO
     */
    public postEntry(element: Models.Dtos.WsElementDto, params: Models.Dtos.CreateWsEntryDto) {
        this.busy(true);
        const thisService = this;

        return this.Restangular
            .one("elements", element.property.entryTargetId)
            .customPOST(params, "entries")
            .then((entry: Models.Dtos.WsEntryDto) => {
                // 追加されたElementをデータに追加する
                this.entryArray.push(entry);
                this.initEntry(entry);
                this._isDirty = false;
                return entry;
            })
            .finally(() => {
                thisService.busy(false);
            });
    }

    /**
     * バイナリー情報リストを読み込む。
     * @param wsId {number}
     * @return {IPromise<WsAssignmentService>}
     */
    public loadBlobDataList(wsId: number): ng.IPromise<WsAssignmentService> {
        this.busy(true);
        return this.Restangular
            .one("ws", wsId).all("files")
            .getList<Models.Dtos.BlobUrlDto>()
            .then((l) => this.blobDataList = l.filter((b) => b.urlInfo.blobEncodeStatus === Anzas.Manacy.Models.Dtos.BlobEncodeStatusEnum.Done))
            .then(() => this)
            .finally(() => this.busy(false));
    }

    /**
     * バイナリー情報を問い合わせる。
     * @param fileId {string}
     * @return {ng.IPromise<Models.Dtos.BlobUrlDto>}
     */
    public fetchBlobData(fileId: string): ng.IPromise<Models.Dtos.BlobUrlDto> {
        const cachingBlobData = this.blobDataList.filter((b) => b.id === fileId)[0];
        if (cachingBlobData) {
            return this.$q.resolve(cachingBlobData);
        }

        this.busy(true);
        const promise = this.Restangular.one("media").one("file", fileId).get()
            .then((blobData: Models.Dtos.BlobUrlDto) => {
                if (blobData.urlInfo.blobEncodeStatus !== Anzas.Manacy.Models.Dtos.BlobEncodeStatusEnum.Done) {
                    return this.$q.reject(`対象ファイルのアップロードは完了してません。fileId: ${fileId}`);
                }
                return blobData;
            })
            .finally(() => this.busy(false));

        promise.then((b) => this.blobDataList.push(b));

        return promise;
    }

    /**
     * ワークシート読み込み
     * @param wsId
     * @returns {IPromise<TResult>}
     */
    public loadWs(wsId: string): ng.IPromise<void> {
        this.busy(true);

        return this.Restangular
            .one("ws", wsId)
            .get<Models.Dtos.WsDto>()
            .then((ws) => {
                this.ws = ws;
            }).finally(() => {
                this.busy(false);
            });
    }

    /**
     * ディレクトリを読み込み
     * @returns {IPromise<TResult>}
     */
    public loadDirectories(): ng.IPromise<void> {

        return this.Restangular
            .all("directories")
            .getList()
            .then((response) => {
                this.directories = response;
            });
    }

    /**
     * assignmentを新規作成する
     * @param assignmentDto
     * @returns {IPromise<any>}
     */
    public createAssignments(assignmentDto: Models.Dtos.WsAssignmentDto) {
        this.busy(true);

        return this.Restangular
            .all("assignments")
            .post(assignmentDto)
            .then((result) => {
                this.assignment = result;
            })
            .finally(() => {
                this.busy(false);
            });
    }

    /**
     * assignmentを更新する
     * @param assignmentDto
     * @returns {IPromise<any>}
     */
    public updateAssignments(assignmentDto: Models.Dtos.WsAssignmentDto) {
        this.busy(true);

        return this.Restangular
            .one("assignments", assignmentDto.id)
            .customPUT(assignmentDto)
            .finally(() => {
                this.busy(false);
            });
    }

    /**
     * assignmentを削除する
     * @param assignmentId
     */
    public deleteAssignments(assignmentId: number) {
        this.busy(true);

        return this.Restangular
            .one("assignments", assignmentId)
            .remove()
            .finally(() => {
                this.busy(false);
            });
    }
}
