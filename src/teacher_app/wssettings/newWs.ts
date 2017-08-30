import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import WsService from "../../services/wsService";
import app from "../app";

export default class NewWs extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.newws";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wssettings/newWs.html";
    }

    /**
     * インジェクトするサービス
     */
    public static $inject = ["$stateParams", "$location"];

    /**
     * コンストラクタ
     */
    public constructor(
        public $stateParams,
        public $location,
    ) {
        super($stateParams);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/ws/new/settings",
            abstract: true,
        };

    private page = "settings";
}

NewWs.register(app.getModule());
