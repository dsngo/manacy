import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";

export default class WsElementNav extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementNav";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            selectedElementId: "<",
            onClick: "&",
        };
        options.templateUrl = "../components/ws/wsElementNav.html";
    }

    public selectedElementId: DtoIdType;

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
    ) {
        super();
    }
}
