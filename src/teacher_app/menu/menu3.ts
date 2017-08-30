import * as uiRouter from "angular-ui-router";
import MenuBase from "../../pages/menuBase";
import app from "../app";

export default class Menu3 extends MenuBase {
    public menu;

    public $onInit(): void {
        this.menu.headline = "ワークシートを見る";
        this.menu.enableBackTo();
        this.menu.isDeviceMode();
    }

    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.menu.menu3";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "./menu/menu3.html";
        options.require = {
            menu: "^^auth.menu",
        };
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/menu3",
        };
}

Menu3.register(app.getModule());
