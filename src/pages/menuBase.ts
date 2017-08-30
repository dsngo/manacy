import * as uiRouter from "angular-ui-router";
import PageComponent from "./pageBase";

export default class MenuBase extends PageComponent {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.menu";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "menu/menuBase.html";
    }

    public static $inject: string[] = ["$mdMedia"];

    constructor(
        private $mdMedia: angular.material.IMedia,
        public $scope: ng.IScope,
    ) {
        super($scope);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/menu",
            abstract: true,
        };

    private arrow: string;
    private backingEnabled: boolean = false;

    public enableBackTo(): void {
        this.backingEnabled = true;
    }

    public disableBackTo(): void {
        this.backingEnabled = false;
    }

    public canBackTo(): boolean {
        return this.backingEnabled;
    }

    public prev(): void {
        this.arrow = "prev";
    }

    public next(): void {
        this.arrow = "next";
    }

    /**
     * デバイス表示かを判定する。
     * @return {boolean} デバイス表示の場合はtrue、そうでない場合はfalse
     */
    public isDeviceMode(): boolean {
        return this.$mdMedia("xs");
    }
}
