import * as uiRouter from "angular-ui-router";
import MenuBase from "../../pages/menuBase";
import app from "../app";

export default class Menu extends MenuBase {
    public menu;

    public $onInit(): void {
        this.menu.headline = "";
        this.menu.disableBackTo();
        this.menu.isDeviceMode();
    }

    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.menu.menu";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "./menu/menu.html";
        options.require = {
            menu: "^^auth.menu",
        };
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/",
        };
}

Menu.register(app.getModule());
