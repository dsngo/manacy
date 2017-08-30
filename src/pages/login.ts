import * as uiRouter from "angular-ui-router";
import IdentityService from "../services/IdentityService";
import PageComponent from "./pageBase";

export default class LoginPage extends PageComponent {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "login";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "login.html";
    }

    /**
     * ui-uiRouterのstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/login",
    };

    // Inject Services
    public static $inject = ["$state", "$mdToast", IdentityService.IID];

    public constructor(
        private $state: uiRouter.StateService,
        private $mdToast: angular.material.IToastService,
        private identityService: IdentityService
    ) {
        super(null);
    }

    public username: string;
    public password: string;
    public loginButtonIsDisabled: boolean = false;

    public onLoginClick(goto: string): void {
        this.loginButtonIsDisabled = true;
        // callback中で使うためにthisを保存
        const __this = this;

        this.identityService.login(this.username, this.password).then(
            () => {
                __this.identityService.resume(goto);
            },
            () => {
                __this.loginButtonIsDisabled = false;
                __this.$mdToast.showSimple("ユーザー名またはパスワードが正しくありません。");
            });
    }

}
