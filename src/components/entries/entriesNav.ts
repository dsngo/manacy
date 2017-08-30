import ComponentBase from "../componentBase";

export default class EntriesNav extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appEntriesNav";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/entries/entriesNav.html";
    }
}
