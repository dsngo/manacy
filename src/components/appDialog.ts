import * as angular from "angular";
/**
 * Dialog用汎用Controller
 */
export default class AppDialog {
    /**
     * InjectするService
     */
    public static $inject = ["$mdDialog"];

    /**
     * コンストラクタ
     * @param wsService
     */
    public constructor(
        public $mdDialog: ng.material.IDialogService,
    ) {
    }

    public hide(response) {
        this.$mdDialog.hide(response);
    }

    public cancel(response) {
        this.$mdDialog.cancel(response);
    }

    /**
     * ダイアログ表示設定を返す
     * @param
     */
    protected static getDialogOptions($event): ng.material.IDialogOptions {
        return {
            // 将来componet styleがサポートされたら変更する
            controller: this,
            controllerAs: "$ctrl",
            bindToController: true,
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
        };
    }
}
