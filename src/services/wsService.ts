import * as _ from "lodash";
import * as restangular from "restangular";
import Models from "../models/models";
import ServiceBase from "./serviceBase";

export default class WsService extends ServiceBase  {
    /**
     * 登録サービス名
     */
    public static readonly IID = "wsService";     // 定数で定義すること

    /**
     * インジェクトするサービス
     */
    private static $inject = ["Restangular", "$q"];

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
     * Wsオブジェクト
     */
    public ws: Models.Dtos.WsDto = null;

    /**
     * WsElement（配列）
     */
    public elementArray: Models.Dtos.WsElementDto[] = null;
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
    /*
     * セメスター（配列）
     */
    public semesterDtos: Models.Dtos.SemesterDto[];

    get semesters(): Models.Dtos.SemesterDto[] {
        return this.semesterDtos;
    }

    /**
     * データ読み込み
     */
    public load(wsId: string): ng.IPromise<WsService> {
        this.busy(true);

        const promise1 = this.Restangular
            .one("ws", wsId)
            .get<Models.Dtos.WsDto>()
            .then((ws) => {
                this.ws = ws;
            });

        const promise2 = this.Restangular
            .one("ws", wsId).all("elements")
            .getList<Models.Dtos.WsElementDto>()
            .then((elements) => {
                this.elementArray = elements;
            });

        return this.$q.all([promise1, promise2]).then((values) => {
            this.InitiallizeData();
            return this;
        }).finally(() => {
            this.busy(false);
        });
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
     * Element配列関連データの初期化
     */
    private InitiallizeData(): void {
        // ------------------------
        // Elementの初期化
        // ------------------------
        // callback中のthisを保持するためにLocal Fat Arrowを使う
        // https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript
        this.elementsBy = {};
        this.elementArray.forEach((element) => this.initElement(element));
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
     * ワークシートを新規作成する
     * @param create パラメーター
     */
    public createWs(wsDto: Models.Dtos.WsDto): ng.IPromise<Models.Dtos.WsDto> {
        this.busy(true);

        return this.Restangular
            .all("ws")
            .post(wsDto)
            .finally(() => {
                this.busy(false);
            });
    }

    /**
     * ワークシート情報を更新する
     * @param create パラメーター
     */
    public updateWs(wsDto: Models.Dtos.WsDto): ng.IPromise<Models.Dtos.WsDto> {
        this.busy(true);
        return this.Restangular
            .one("ws", wsDto.wsElementId)
            .customPUT(wsDto)
            .finally(() => {
                this.busy(false);
            });
    }

    // public loadSemesters(): ng.IPromise<void> {
    //
    //     return this.Restangular
    //         .all("semesters")
    //         .getList()
    //         .then((response) => {
    //             this.semesterDtos = response;
    //             return;
    //         });
    // }

    /**
     * Elementの子Elementの配列を並び替えて取得する。
     * @param element
     * @return {Models.Dtos.WsElementDto[]}
     */
    public getOrderedChildElements(element: Models.Dtos.WsElementDto): Models.Dtos.WsElementDto[] {
        const elements = this.getChildElements(element);
        elements.sort((a, b) => a.property.sortOrder - b.property.sortOrder);
        return elements;
    }

    /**
     * WSを一覧から削除する
     */
    public delete(wsId) {
        this.busy(true);
        return this.Restangular
            .one("ws", wsId)
            .remove()
            .finally(() => this.busy(false));
    }
}
