import * as uiRouter from "angular-ui-router";
import IdentityService from "../services/IdentityService";
import ComponentBase from "./componentBase";

export default class AppHeader extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appHeader";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings = {
            title: "<",
            backTo: "<",
        };
        options.templateUrl = "../components/appHeader.html";
        options.transclude = true;
    }

    public title: string;

    public static $inject = [IdentityService.IID, "$state", "$window"];

    public constructor(
        public identityService: IdentityService,
        public $state: uiRouter.StateService,
        public $window: ng.IWindowService,
    ) {
        super();
    }

    public logoff(): void {
        this.identityService.logoff();
        this.$state.go("login");

        // PHP版のログイン画面へ遷移
        // this.$window.location.href = "/app2/index.php";
    }
}
