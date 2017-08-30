import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import app from "../app";

class TemplatesPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.templates";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./templates/templates.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/templates",
    };
}

TemplatesPage.register(app.getModule());
