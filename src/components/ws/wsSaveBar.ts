import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";

export default class WsSaveBar extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsSaveBar";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsSaveBar.html";
    }

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, "$scope"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    public save() {
        this.wsAssignmentService.save(this.$scope);
    }

}
