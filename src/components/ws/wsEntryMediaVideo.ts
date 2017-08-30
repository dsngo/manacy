import WsEntryMediaBlob from "./wsEntryMediaBlob";

export default class WsEntryMediaVideo extends WsEntryMediaBlob {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryMediaVideo";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings.layoutType = "@?";
        options.templateUrl = "../components/ws/wsEntryMediaVideo.html";
    }

    /**
     * 再生中のビデオコンポネント
     */
    private static playingVideo: WsEntryMediaVideo;

    /**
     * 再生リスナリスト
     */
    private static onPlayListeners: Array<() => void> = [];

    /**
     * 再生プレーヤコントローラ
     */
    public videogular: angular.vg.IVgController;

    /**
     * ソースリスト
     */
    public sources: angular.vg.IMediaSource[];

    /**
     * videogularのレイアウトテーマ
     */
    public theme: string = "https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css";

    /**
     * レイアウト
     */
    private layoutType: string;

    /**
     * 再生リスナ停止関数
     */
    private stopPlayListener: () => void;

    /**
     * 再生時に処理を実行する。
     * @param listener
     * @return {()=>void} リスナー停止関数
     */
    private static onPlay(listener: () => void): () => void {
        this.onPlayListeners = this.onPlayListeners.concat(listener);

        return () => {
            this.onPlayListeners = this.onPlayListeners.filter((l) => l !== listener);
        };
    }

    /**
     * 再生する。
     * @param video
     */
    private static play(video: WsEntryMediaVideo): void {
        WsEntryMediaVideo.playingVideo = video;
        WsEntryMediaVideo.onPlayListeners.forEach((l) => l());
    }

    public $onInit(): void {
        super.$onInit();

        this.stopPlayListener = WsEntryMediaVideo.onPlay(() => {
            if (this.plays()) {
                return;
            }

            this.videogular.reset();
        });
    }

    public $onDestroy(): void {
        this.stopPlayListener();
    }

    /**
     * 再生する。
     */
    public play(): void {
        WsEntryMediaVideo.play(this);
    }

    /**
     * 再生しているかを判定する。
     * @return {boolean}
     */
    public plays(): boolean {
        return this === WsEntryMediaVideo.playingVideo;
    }

    /**
     * タッチデバイスかを判定する。
     * @return {boolean}
     */
    public isTouchDevice(): boolean {
        return window.ontouchstart === null;
    }

    /**
     * ミニレイアウトかを判定する。
     * @return {boolean}
     */
    public isMiniLayout(): boolean {
        return this.layoutType === "mini" && !this.videogular.isFullScreen;
    }

    /**
     * ファイル情報の読込完了時に実行する。
     */
    protected onLoaded(): void {
        this.sources = [
            {src: this.blobUrl, type: this.entry.jsonData.file.contentType},
        ];
    }

    /**
     * サムネイルURLを取得する。
     * @return {string}
     */
    public get thumbUrl(): string {
        if (!this.blobData) {
            return null;
        }

        return this.blobData.urlInfo.thumbnailUrl;
    }
}
