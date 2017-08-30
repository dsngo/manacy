import WsEntryMediaBlob from "./wsEntryMediaBlob";

export default class WsEntryMediaFile extends WsEntryMediaBlob {
    /**
     * 登録コンポーネント名
     */
    public static IID: string = "appWsEntryMediaFile";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryMediaFile.html";
    }
}
