import AuthorizedPage from "./authorizedPage";
import LoginPage from "./login";
import MenuBase from "./menuBase";
import UserPage from "./user";
import WsPage from "./ws";

export default function registerPages(app: ng.IModule) {
    AuthorizedPage.register(app);
    LoginPage.register(app);
    MenuBase.register(app);
    UserPage.register(app);
    WsPage.register(app);

}
