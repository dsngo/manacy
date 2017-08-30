import * as uiRouter from "angular-ui-router";
import * as _ from "lodash";
import AutoRefreshWsPage from "../../pages/autoRefreshWs";
import WsAssignmentService from "../../services/wsAssignmentService";
import app from "../app";

class PeerWorksheetPage extends AutoRefreshWsPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.ws.peerws";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./ws/peerws.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/peerws",
    };

    public selectedUserId: DtoIdType;

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        super.$onInit();

        let user: Anzas.Manacy.Models.Dtos.DisplayUserDto;

        for (const key in this.userGroups) {
            if (this.userGroups.hasOwnProperty(key)) {
                user = this.userGroups[key].find((value, index, obj) => {
                    return value.student != null;
                });
                if (user) { break; }
            }
        }

        this.selectedUserId = user.id;
    }

    public get userGroups() {
        return this.wsAssignmentService.myUserGroups;
        // return this.wsAssignmentService.ws.enableGroup ? this.wsAssignmentService.myUserGroups : this.wsAssignmentService.userGroups;
    }

    public onUserClick(userId: DtoIdType) {
        this.selectedUserId = userId;
    }

}

PeerWorksheetPage.register(app.getModule());
