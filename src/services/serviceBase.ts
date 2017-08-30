export default class ServiceBase {
    /**
     * サービス名（必ず派生先で正しいサービス名でオーバーライドすること）
     */
    public static readonly IID: string;

    /**
     * サービスを登録する
     */
    public static register(app: angular.IModule) {
        // const nam = '$' + app.utils.convertClassName(this.toString());
        app.service(this.IID, this);
    }

    private static busyCount: number = 0;

    /**
     * サービスが通信中かどうか（全サービス共通）
     */
    public get isBusy(): boolean {
        return ServiceBase.busyCount > 0;
    }

    /**
     * サービスの通信状態を設定（全サービス共通）
     * @param flag true:通信中／false:通信中でない
     */
    protected busy(flag: boolean): void {
        ServiceBase.busyCount += flag ? 1 : -1;
    }
}
