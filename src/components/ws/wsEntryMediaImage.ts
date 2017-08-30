import WsEntryMediaBlob from "./wsEntryMediaBlob";

export default class WsEntryMediaImage extends WsEntryMediaBlob {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryMediaImage";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryMediaImage.html";
    }
}
