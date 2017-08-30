import * as _ from "lodash";
import Models from "../../models/models";
import ComponentBase from "../componentBase";
import WsAssignmentService from "../../services/wsAssignmentService";

export default class WsEntryMediaBlob extends ComponentBase {
    /**
     * ファイル情報のリロード時間
     * @type {number}
     */
    private static RELOAD_TIME: number = 15 * 1000;

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);

        _.extend(options, {
            bindings: {
                entry: "<",
            },
        });
    }

    public entry: Models.Dtos.WsEntryDto;

    protected blobData: Models.Dtos.BlobUrlDto;

    public static $inject: string[] = ["$timeout", WsAssignmentService.IID];

    public constructor(private $timeout: ng.ITimeoutService, private wsAssignmentService: WsAssignmentService) {
        super();
    }

    protected $onInit(): void {
        this.load().then(() => this.onLoaded());
    }

    /**
     * ファイルURLを取得する。
     * @return {string}
     */
    public get blobUrl(): string {
        if (!this.blobData) {
            return null;
        }

        return this.blobData.urlInfo.blobUrl;
    }

    /**
     * ファイル情報を読み込む。
     */
    private load(): ng.IPromise<void> {
        return this.wsAssignmentService.fetchBlobData(this.entry.jsonData.file.fileId)
            .then((b) => this.blobData = b)
            .catch(() => this.$timeout(() => this.load(), WsEntryMediaBlob.RELOAD_TIME))
            .then(() => void 0);
    }

    /**
     * ファイル情報の読込完了時に実行する。
     */
    protected onLoaded(): void {/* no process */}
}
