import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import app from "../app";
// import WsService from "../../services/wsService";

export default class Assignment extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.assginment";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.template = "<ui-view></ui-view>";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/assginments/{assignmentId:[0-9]{1,}}",
            abstract: true,
        };
}

Assignment.register(app.getModule());
