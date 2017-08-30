import WsEntryMediaBlob from "./wsEntryMediaBlob";

export default class WsEntryMediaAudio extends WsEntryMediaBlob {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryMediaAudio";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryMediaAudio.html";
    }
}
