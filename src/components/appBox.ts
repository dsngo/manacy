import ComponentBase from "./componentBase";

export default class AppBox extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appBox";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            headline: "@",
        };
        options.templateUrl = "../components/appBox.html";
        options.transclude = true;
    }
}
