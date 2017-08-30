import * as uiRouter from "angular-ui-router";
import IdentityService from "../../services/IdentityService";
import ComponentBase from "../componentBase";

export default class ViewMenu extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static IID: string = "appViewMenu";

    /**
     * 通常メニュー表示フラグ
     */
    private basicMenuOpenFlg: boolean = false;

    public static $inject: string[] = ["$state", "$mdMedia", IdentityService.IID];

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/view/viewMenu.html";
        options.transclude = true;
    }

    constructor(
        private $state: uiRouter.StateService,
        private $mdMedia: angular.material.IMedia,
        public identityService: IdentityService,
    ) {
        super();
    }

    /**
     * 通常メニューの表示を切り替える。
     */
    public toggleBasicMenu() {
        this.basicMenuOpenFlg = !this.basicMenuOpenFlg;
    }

    /**
     * ログアウトする。
     */
    public logoff(): void {
        this.identityService.logoff();
        this.$state.go("login");
    }

    /**
     * デバイス表示かを判定する。
     * @return {boolean} デバイス表示の場合はtrue、そうでない場合はfalse
     */
    public isDeviceMode(): boolean {
        return this.$mdMedia("xs");
    }

    /**
     * 通常メニューを表示するかを判定する。
     * @return {boolean}
     */
    public hasOpenBasicMenu(): boolean {
        return !this.isDeviceMode() || this.basicMenuOpenFlg;
    }
}
