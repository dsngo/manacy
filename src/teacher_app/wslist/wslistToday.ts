import * as uiRouter from "angular-ui-router";
import WsList from "../../components/wslist/wsList";
import WsAssignmentsService from "../../services/WsAssignmentService";
import app from "../app";
import WsListPage from "./wsList";

class WsListTodayPage extends WsListPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wslist.today";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wslist/wslistToday.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/today",
    };

}

WsListTodayPage.register(app.getModule());
