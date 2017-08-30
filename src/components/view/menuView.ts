import View from "./view";

export default class MenuView extends View {
    /**
     * 登録コンポーネント名
     */
    public static IID: string = "appMenuView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/view/menuView.html";
    }
}
