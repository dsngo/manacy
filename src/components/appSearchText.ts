import ComponentBase from "./componentBase";

export default class AppSearchText extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appSearchText";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/appSearchText.html";
    }
}
