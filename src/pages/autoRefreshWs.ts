import * as uiRouter from "angular-ui-router";
import WsPage from "./ws";

export default class AutoRefreshWsPage extends WsPage {
    public static $inject: string[] = WsPage.$inject.concat("$stateParams", "$timeout");

    /**
     * データ更新ポーリングの間隔
     */
    private static readonly REFRESH_POLING_TIME: number = 15 * 1000;

    private refreshPromise: ng.IPromise<any>;

    constructor(scope: ng.IScope, private $stateParams: uiRouter.StateParams, private $timeout: ng.ITimeoutService) {
        super(scope);
    }

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        // 指定の時間毎にワークシート情報を再読込する。
        const refreshAsync = () => {
            this.refreshPromise = this.$timeout(() => {
                this.wsAssignmentService.load(this.$stateParams.wsId).then(() => {
                    this.wsAssignmentService.reLoad(this.$scope);
                    refreshAsync();
                });
            }, AutoRefreshWsPage.REFRESH_POLING_TIME);
        };
        refreshAsync();
    }

    /**
     * 廃棄処理
     */
    protected $onDestroy() {
        this.$timeout.cancel(this.refreshPromise);
    }
}
