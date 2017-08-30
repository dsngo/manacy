import * as uiRouter from "angular-ui-router";
import AuthorizedPage from "../../../pages/authorizedPage";
import WsAssignmentService from "../../../services/wsAssignmentService";
import app from "../../app";

export default class AssignmentSettings extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.assginment.settings";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
         options.templateUrl = "./assignment/settings/assignmentSettings.html";
    }

    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, AssignmentSettings.state);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/settings",
            abstract: true,
            resolve: {
                wsAssignmentService: [WsAssignmentService.IID, "$transition$", "$q",
                    (wsAssignmentService: WsAssignmentService, $transition$: uiRouter.Transition, $q: ng.IQService) => {
                    const assignmentId = $transition$.params().assignmentId;
                    return $q.all([wsAssignmentService.load(assignmentId)]).then(() => wsAssignmentService);
                }],
            },
        };

    public wsAssignmentService: WsAssignmentService;
}

AssignmentSettings.register(app.getModule());
