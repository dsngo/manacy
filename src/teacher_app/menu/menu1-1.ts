import * as uiRouter from "angular-ui-router";
import MenuBase from "../../pages/menuBase";
import app from "../app";

export default class Menu1and1 extends MenuBase {
    public menu;

    public $onInit(): void {
        this.menu.headline = "新規作成";
        this.menu.enableBackTo();
        this.menu.isDeviceMode();
    }

    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.menu.menu1and1";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "./menu/menu1-1.html";
        options.require = {
            menu: "^^auth.menu",
        };
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/menu1-1",
        };
}

Menu1and1.register(app.getModule());
