import ComponentBase from "../componentBase";

export default class EntriesView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appEntriesView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/entries/entriesView.html";
    }

    public columns: number = 2;

    public sliderChange() {
        console.log(this.columns);
    }
}
