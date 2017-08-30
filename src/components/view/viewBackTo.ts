import ComponentBase from "../componentBase";

/**
 * 画面テンプレートの戻るボタン
 */
export default class ViewBackTo extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static IID: string = "appViewBackTo";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/view/viewBackTo.html";
    }

    /**
     * 一つ前の画面に戻る。
     */
    public back(): void {
        // TODO: 「一つ前の画面に戻る」を最適な挙動で実装するのは、簡単ではない。
        // そのため、とりあえずブラウザバックと同じ動作で実装する。
        history.back();
    }
}
