import * as uiRouter from "angular-ui-router";
import AutoRefreshWsPage from "../../pages/autoRefreshWs";
import IdentityService from "../../services/IdentityService";
import app from "../app";

class WsElementsPage extends AutoRefreshWsPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.ws.elements";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./ws/wsElements.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/elements",
    };

    public selectedElementId: DtoIdType;
    public userGroups: Ws.IUserGroups;

    protected $onInit(): void {
        super.$onInit();

        this.userGroups = this.wsAssignmentService.userGroups;
    }

    public onElementSelected(elementId: DtoIdType) {
        this.selectedElementId = elementId;
    }

    public get selectedElement() {
        return this.wsAssignmentService.elements[this.selectedElementId];
    }

}

WsElementsPage.register(app.getModule());
