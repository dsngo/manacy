import * as uiRouter from "angular-ui-router";
import AutoRefreshWsPage from "../../pages/autoRefreshWs";
import app from "../app";

class MywsPage extends AutoRefreshWsPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.ws.myws";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./ws/myws.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/myws",
    };
}

MywsPage.register(app.getModule());
