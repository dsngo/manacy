import ComponentBase from "./componentBase";

export default class AppSideNav extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appSideNav";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            sideNavOpenFlg: "=?",
        };
        options.templateUrl = "../components/appSideNav.html";
        options.transclude = true;
    }

    public static $inject: string[] = ["$mdMedia"];

    constructor(private $mdMedia: angular.material.IMedia) {
        super();
    }

    /**
     * サイドナビ表示フラグ
     */
    public sideNavOpenFlg: boolean;

    /**
     * サイドナビの表示を切り替える。
     */
    public toggleSideNav(): void {
        this.sideNavOpenFlg = !this.hasOpenSideNav();
    }

    /**
     * デバイス表示かを判定する。
     * @return {boolean} デバイス表示の場合はtrue、そうでない場合はfalse
     */
    public isDeviceMode(): boolean {
        return this.$mdMedia("xs");
    }

    /**
     * サイドナビを表示するかを判定する。
     */
    public hasOpenSideNav(): boolean {
        return "sideNavOpenFlg" in this ? this.sideNavOpenFlg : true;
    }
}
