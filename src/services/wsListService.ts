import * as restangular from "restangular";
import Models from "../models/models";
import ServiceBase from "./serviceBase";

export default class WsListService extends ServiceBase {
    /**
     * 登録サービス名
     */
    public static readonly IID = "wsListService";

    /**
     * インジェクトするサービス
     */
    public static $inject = ["Restangular"];

    public constructor(protected Restangular: restangular.IService) {
        super();
    }

    public wsDraftList: Models.Dtos.WsDto[] = [];
    public wsList: Models.Dtos.WsDto[] = [];

    /**
     * WS一覧を取得する
     */
    public search(): ng.IPromise<WsListService> {
        this.busy(true);

        return this.Restangular
            .all("ws")
            .customPOST({/* searchParam */}, "search")
            .then((wsList: Models.Dtos.WsDto[]) => {
                this.wsDraftList = [];
                this.wsList = [];

                // 取得したワークシートを下書きとそうでないものに分けて格納する
                for (const ws of wsList) {
                    if (ws.accessLevel === 0) {
                        this.wsDraftList.push(ws);
                    } else {
                        this.wsList.push(ws);
                    }
                }
            })
            .then(() => this)
            .finally(() => this.busy(false));
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
