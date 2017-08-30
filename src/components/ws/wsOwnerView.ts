import Models from "../../models/models";
import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";
import { IWsElementParams } from "./wsElementParams";

export default class WsOwnerView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsOwnerView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings = {
            ownerUserId: "<",
            currentUser: "<",
            editMode: "<",
        };
        options.templateUrl = "../components/ws/wsOwnerView.html";
        options.transclude = true;
    }

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, "$scope"];

    /**
     * コンストラクタ
     * @param wsService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    public ownerUserId: DtoIdType;
    public currentUser: Models.Dtos.UserDto;
    public editMode: boolean;

    public params: { [wsElementId: string]: IWsElementParams } = {};

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        this.$scope.$watch(
            () => this.ownerUserId,
            () => { this.params = {}; },
        );
        this.$scope.$watch(
            () => this.currentUser,
            () => { this.params = {}; },
        );

    }

    public getParams(element: Models.Dtos.WsElementDto): IWsElementParams {
        if (!element) {
            return null;
        }
        if (!(element.wsElementId in this.params) || this.params[element.wsElementId].element !== element) {
            this.params[element.wsElementId] = {
                element,
                ownerUserId: this.ownerUserId,
                currentUser: this.currentUser,
                editMode: this.editMode,
            };
        }
        return this.params[element.wsElementId];
    }

}
