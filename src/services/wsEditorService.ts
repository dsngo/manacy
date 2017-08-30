import * as _ from "lodash";
import * as restangular from "restangular";
import Models from "../models/models";
import ServiceBase from "./serviceBase";
import WsService from "./wsService";

// declare global {
//     const WsEditorServiceIID = 'wsEditorService';
// }

export default class WsEditorService extends ServiceBase {
    /**
     * 登録サービス名
     */
    public static readonly IID = "wsEditorService";     // 定数で定義すること

    /**
     * インジェクトするサービス
     */
    private static $inject = ["Restangular", "$q", WsService.IID];

    // export const enum WsElementTypeEnum {
    //     noentry = 0,
    //     basic = 1,
    //     chat = 2,
    //     discussion = 3,
    //     selection = 4,
    //     rubric = 5
    // }
    /**
     * ElementType名の配列
     */
    public readonly elementTypeArray = ["noentry", "basic", "chat", "discussion", "selection", "rubric"];

    //  * export const enum AccessPermissionEnum {
    //  * 	NoAccess = 0,
    //  * 	ReadOnly = 1,
    //  * 	ReadWrite = 2
    //  * }
    /**
     * WsElementAccessLevel名
     */
    public readonly elementAccessLevelArray = [
        { id: 0, name: "NoAccess" }, { id: 1, name: "ReadOnly" }, { id: 2, name: "ReadWrite" }];

    //  * export const enum WsElementShareLevelEnum {
    //  * 	Individual = 0,
    //  * 	Group = 1,
    //  * 	Course = 2
    //  * }
    /**
     * WsElementShareLevel名
     */
    public readonly elementShareLevelArray = [
        { id: 0, name: "Individual" }, { id: 1, name: "Group" }, { id: 2, name: "Course" }];

    /**
     * WsOrigin（配列）
     */
    public originArray: Models.Dtos.WsOriginDtoForEditor[];

    public originBy: { [id: string]: Models.Dtos.WsOriginDtoForEditor };

    /**
     * WsOriginCategory（配列）
     */
    public originCategoryArray: Models.Dtos.WsOriginCategoryDto[];

    /**
     * WsOriginCategoryをid値から検索する
     */
    public originCategoryBy: { [id: string]: Models.Dtos.WsOriginCategoryDto };

    /**
     * WsElement（配列）
     */
    private originElementArray: Models.Dtos.WsElementDto[] = null;

    /**
     * 編集前のElements（クローン）
     */
    private initialElementsBy: { [key: string]: Models.Dtos.WsElementDto };

    /**
     * コンストラクタ
     */
    public constructor(
        protected Restangular: restangular.IService,
        protected $q: ng.IQService,
        protected wsService: WsService,
    ) {
        super();
    }

    /**
     * データ読み込み
     */
    public load(): ng.IPromise<WsEditorService> {
        this.busy(true);
        const thisService = this;

        const promise1 = this.Restangular
            .all("origins")
            .getList<Models.Dtos.WsOriginDtoForEditor>()
            .then((origins) => {
                thisService.originArray = origins;
                return;
            });

        const promise2 = this.Restangular
            .all("origins").all("elements")
            .getList<Models.Dtos.WsElementDto>()
            .then((elements) => {
                thisService.originElementArray = elements;
                return;
            });

        const promise3 = this.Restangular
            .all("origins").all("categories")
            .getList<Models.Dtos.WsOriginCategoryDto>()
            .then((categories) => {
                thisService.originCategoryArray = categories;
                return;
            });

        return this.$q.all([promise1, promise2, promise3]).then(() => {
            thisService.InitiallizeData();
            return thisService;
        }).finally(() => {
            thisService.busy(false);
        });
    }

    /**
     * Element配列関連データの初期化
     */
    private InitiallizeData(): void {
        this.initialElementsBy = _.cloneDeep(this.wsService.elements);
        this.originBy = _.keyBy(this.originArray, "wsElementId");
        this.originCategoryBy = _.keyBy(this.originCategoryArray, "id");
    }

    /**
     * ワークシートを新規作成する
     * @param create パラメーター
     */
    public createWs(create: Models.Dtos.WsDto): ng.IPromise<void> {
        this.busy(true);
        const thisService = this;

        return this.Restangular
            .all("ws")
            .customPOST(create)
            .then((ws) => {
                // thisService.origins = origins;
                return;
            })
            .finally(() => {
                thisService.busy(false);
            });

    }

    /**
     * Elementを新規作成（追加）する
     * @param params Elementを新規作成（追加）する際のパラメータ
     */
    public async addElement(params: Models.Dtos.CreateWsElementDto) {
        this.busy(true);
        const thisService = this;

        return await this.Restangular
            .all("elements")
            .customPOST(params)
            .then((elements: Models.Dtos.WsElementDto[]) => {
                // 追加されたElementをデータに追加する
                elements.forEach((element) => {
                    thisService.wsService.addElement(element);
                    thisService.initialElementsBy[element.wsElementId] = _.cloneDeep(element);
                });
                return;
            })
            .finally(() => {
                thisService.busy(false);
            });
    }

    /**
     * 現在アクティブな（編集中の）Element
     */
    // tslint:disable-next-line:variable-name
    protected _activeElement: Models.Dtos.WsElementDto;

    /**
     * 現在アクティブな（編集中の）Element
     */
    public get activeElement() {
        return this._activeElement;
    }

    /**
     * 現在アクティブなElementを変更する
     */
    public set activeElement(value: Models.Dtos.WsElementDto) {
        if (this._activeElement && value !== this._activeElement) {
            // 変更時に保存する
            this.save();
        }
        this._activeElement = value;
    }

    /**
     * 変更を（あれば）保存する
     */
    public save(targetElement: Models.Dtos.WsElementDto = this._activeElement): ng.IPromise<void> {
        this.busy(true);
        const initialElement = this.initialElementsBy[targetElement.wsElementId];
        const promises: Array<angular.IPromise<void>> = [];

        if (!_.isEqual(targetElement.property, initialElement.property)) {
            promises.push(
                this.Restangular
                    .one("elements", targetElement.wsElementId)
                    .customPOST(targetElement.property, "properties")
                    .then((element: Models.Dtos.WsElementDto) => {
                        targetElement.property = element.property;
                        initialElement.property = _.cloneDeep(element.property);
                        return;
                    }),
            );
        }

        if (!_.isEqual(targetElement.content, initialElement.content)) {
            // entrySettingsをJSON文字列に変換
            const content: any = _.cloneDeep(targetElement.content);
            content.entrySettings = JSON.stringify(targetElement.content.entrySettings);

            promises.push(
                this.Restangular
                    .one("elements", targetElement.wsElementId)
                    .customPOST(content, "contents")
                    .then((element: Models.Dtos.WsElementDto) => {
                        this.wsService.initElement(element);       // JSON文字列をParseする
                        targetElement.content = element.content;
                        initialElement.content = _.cloneDeep(element.content);
                        return;
                    }),
            );
        }

        return this.$q.all(promises).then(() => {
            return;
        }).finally(() => {
            this.busy(false);
        });

    }

    public get isChanged() {
        const activeElement = this._activeElement;
        const initialElement = this.initialElementsBy[activeElement.wsElementId];
        return !_.isEqual(activeElement.property, initialElement.property) ||
            !_.isEqual(activeElement.content, initialElement.content);
    }

    public cancelChange() {
        this.activeElement.property = _.cloneDeep(this.initialElementsBy[this.activeElement.wsElementId].property);
        this.activeElement.content = _.cloneDeep(this.initialElementsBy[this.activeElement.wsElementId].content);
    }

    public async deleteElement() {
        this.busy(true);
        const thisService = this;
        const id = this._activeElement.wsElementId;
        this._activeElement = null;

        return await this.Restangular
            .one("elements", id)
            .customDELETE("")
            .then(() => {
                // 追加されたElementをデータに追加する
                thisService.wsService.deleteElement(id);
                delete thisService.initialElementsBy[id];
                return;
            })
            .finally(() => {
                thisService.busy(false);
            });

    }

}
