import * as _ from "lodash";
import DirectiveBase from "./directiveBase";

/**
 * bodyタグ用のディレクティブ
 */
export default class Body extends DirectiveBase implements ng.IController {
    /**
     * 登録ディレクティブ名
     */
    public static readonly IID: string = "body";

    /**
     * ディレクティブ定義オブジェクトを設定する。
     * @param ddo {ng.IDirective}
     */
    protected static setDDO(ddo: ng.IDirective): void {
        super.setDDO(ddo);

        _.extend(ddo, {
            restrict: "E",
            controller: Body,
            controllerAs: "$ctrl",
        });
    }

    /**
    * InjectするService
    */
    public static $inject = ["$scope"];

    /**
     * コンストラクタ
     * @param 
     */
    public constructor(
        public $scope: ng.IScope
    ) {
        super();
    }

    /**
     * 
     */
    public themeColor: string = "default";


    public $onInit() {
        this.$scope.$on("setTheme", (event, args) => {
            this.themeColor = args;
        });
    }
}
