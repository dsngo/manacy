import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import app from "../app";

export default class NewAssignment extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.newassignment";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./assignment/newAssignment.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/assginments/new",
            abstract: true,
        };

    private page: string = "properties";
}

NewAssignment.register(app.getModule());
