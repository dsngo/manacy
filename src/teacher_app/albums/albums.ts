import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../pages/authorizedPage";
import app from "../app";

class AlbumsPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.albums";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./albums/albums.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/albums",
        };
}

AlbumsPage.register(app.getModule());
