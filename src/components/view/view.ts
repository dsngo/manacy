import IdentityService from "../../services/IdentityService";
import ComponentBase from "./../componentBase";

/**
 * 画面テンプレート
 */
export default class View extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static IID: string = "appView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/view/view.html";
        options.transclude = {
            backTo: "?appViewBackTo",
            headline: "appViewHeadline",
            toolbar: "?appViewToolbar",
            menuNav: "?appViewMenuNav",
            content: "appViewContent",
        };
    }

    public static $inject: string[] = ["$mdMedia", IdentityService.IID];

    constructor(
        private $mdMedia: angular.material.IMedia,
        public identityService: IdentityService,
    ) {
        super();
    }

    /**
     * デバイス表示かを判定する。
     * @return {boolean} デバイス表示の場合はtrue、そうでない場合はfalse
     */
    public isDeviceMode(): boolean {
        return this.$mdMedia("xs");
    }
}
