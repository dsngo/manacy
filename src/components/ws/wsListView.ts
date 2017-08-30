import ComponentBase from "../componentBase";

export default class WsListView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsListView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/ws/wsListView.html";
    }

    /**
     * ワークシートを作成できるかを判定する。
     * @return {boolean}
     */
    public canCreateWs(): boolean {
        return APP_TYPE === 0;
    }

    /**
     * WSのステートを取得する。
     * @return {string}
     */
    get wsState(): string {
        return APP_TYPE === 0 ? "auth.ws.students" : "auth.ws.myws";
    }
}
