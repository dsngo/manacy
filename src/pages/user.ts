import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "./authorizedPage";

// 仮ユーザインタフェース
interface IDummyUser {
    name: string;
    password: string;
    mail: string;
    color: string;
}

export default class UserPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.user";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../pages/user.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/user",
    };

    /**
     * ユーザ情報
     */
    public user: IDummyUser = {
        name:     "谷本 啓太",
        password: null,
        mail:     "raku@anzas.net",
        color:    "ブルー",
    };

    public colors: string[] = ["ブルー", "イエロー", "レッド"];
}
