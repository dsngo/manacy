import * as uiRouter from "angular-ui-router";
import IdentityService from "../services/IdentityService";
import PageComponent from "./pageBase";

export default class AuthorizedPage extends PageComponent {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.template = "<ui-view></ui-view>";
    }

    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, AuthorizedPage.state);
    }

    /**
     * ui-uiRouterのstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        abstract: true,
        resolve: {
            // IdentityServiceをResolve
            identityService:
            [IdentityService.IID, "$state", "$window",
            (identityService: IdentityService, $state: uiRouter.StateService, $window: ng.IWindowService) => {
                return identityService.VerifySession().then(
                    // success
                    (service) => service,

                    // error
                    () => {
                        // ログイン後に戻れるようにresume stateとして保存しておく
                        identityService.setResumeState();
                        // ログイン画面に遷移
                        // $state.go("login");

                        // PHP版のログイン画面へ遷移
                        $window.location.href = "/app2/index.php";
                    });
            }],
            $mdMedia: ["$mdMedia", ($mdMedia) => $mdMedia],
            // $scope: ["$scope", ($scope) => $scope],
        },
    };

    public identityService: IdentityService;
    public $mdMedia: ng.material.IMedia;
    // public $scope: ng.IScope;

}
