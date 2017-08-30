import * as uiRouter from "angular-ui-router";
import appBase from "../common/appBase";

export default class App extends appBase {

    /**
     * メインモジュール名
     */
    protected static getAppModuleName(): string { return "TeacherApp"; }

    /**
     * アプリケーション初期化処理
     */
    public static Init() {
        // デフォルトURLの設定
        this.getModule().config(["$urlRouterProvider", ($urlRouterProvider: uiRouter.UrlRouter) => {
            $urlRouterProvider.otherwise("/login");
        }]);

        super.Init();
    }
}
