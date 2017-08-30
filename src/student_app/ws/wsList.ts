import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import app from "../app";

class WsListPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wslist";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./ws/wsList.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/ws",
    };
}

WsListPage.register(app.getModule());
