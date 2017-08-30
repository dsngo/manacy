import * as uiRouter from "angular-ui-router";
import WsAssignmentService from "../services/wsAssignmentService";
import AuthorizedPage from "./authorizedPage";

export default class WsPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.ws";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "ws/ws.html";
    }

    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, WsPage.state);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/ws/:wsId",
        abstract: true,
        resolve: {
            wsAssignmentService:
            [WsAssignmentService.IID, "$transition$", "$q",
            (wsAssignmentService: WsAssignmentService, $transition$: uiRouter.Transition, $q: ng.IQService) => {
                const assignmentId = $transition$.params().wsId;
                return wsAssignmentService.load(assignmentId)
                    .then(() => wsAssignmentService.loadBlobDataList(wsAssignmentService.ws.wsElementId))
                    .then(() => wsAssignmentService);
            }],
            $state: ["$state", ($state) => $state],
        },
    };

    public $state: uiRouter.StateService;

    public currentNav: string;
    protected $onInit(): void {
        this.$scope.$watch("$ctrl.$state.current.name", () => {
            this.currentNav = this.$state.current.name;
        });
    }

    public wsAssignmentService: WsAssignmentService;

}
