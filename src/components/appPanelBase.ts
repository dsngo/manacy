export default class AppPanelBase {

    public static newConfig(): ng.material.IPanelConfig {
        return {
            controller: this,
            controllerAs: "$ctrl",
        };
    }

    /**
     * InjectするService
     */
    public static $inject = ["mdPanelRef"];

    /**
     * コンストラクタ
     * @param mdPanelRef
     */
    public constructor(
        public mdPanelRef: ng.material.IPanelRef,
    ) {
    }

    public close(): ng.IPromise<any> {
        return this.mdPanelRef.close();
    }

}
