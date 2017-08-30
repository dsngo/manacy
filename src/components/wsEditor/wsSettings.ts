import ComponentBase from "../componentBase";

export default class WsSettings extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsSettings";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/wsEditor/wsSettings.html";
    }

    // 表示用
    public switchTest: boolean = true;
}
