import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import WsListService from "../../services/wsListService";
import app from "../app";

export default class WsListPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wslist";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wslist/wsList.html";
    }

    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, WsListPage.state);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/ws",
        abstract: true,
        resolve: {
            wsListService: [WsListService.IID, (wsListService: WsListService) => {
                return wsListService.search();
            }],
        },
    };

    public wsListService: WsListService;

}

WsListPage.register(app.getModule());
