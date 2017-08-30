import * as uiRouter from "angular-ui-router";
import * as _ from "lodash";
import AutoRefreshWsPage from "../../pages/autoRefreshWs";
import WsAssignmentService from "../../services/wsAssignmentService";
import app from "../app";

class WsStudentsPage extends AutoRefreshWsPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.ws.students";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./ws/wsStudents.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/students",
    };

    public selectedUserId: DtoIdType;

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        super.$onInit();

        let user: Anzas.Manacy.Models.Dtos.DisplayUserDto;
        let keySave: string = null;

        for (const key in this.userGroups) {
            if (this.userGroups.hasOwnProperty(key)) {
                if (keySave == null || keySave > key) {
                    user = this.userGroups[key].find((value, index, obj) => {
                        return value.student != null;
                    });
                    keySave = key;
                }
            }
        }

        this.selectedUserId = user.id;

    }

    public get userGroups() {
        return this.wsAssignmentService.userGroups;
    }

    public onUserClick(userId: DtoIdType) {
        this.selectedUserId = userId;
    }

}

WsStudentsPage.register(app.getModule());
