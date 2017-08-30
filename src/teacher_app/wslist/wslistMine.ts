import * as uiRouter from "angular-ui-router";
import WsList from "../../components/wslist/wsList";
import WsListService from "../../services/wsListService";
import app from "../app";
import WsListPage from "./wsList";

class WsListMinePage extends WsListPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wslist.mine";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wslist/wslistMine.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/mine",
    };

}

WsListMinePage.register(app.getModule());
