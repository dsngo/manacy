import * as uiRouter from "angular-ui-router";
import WsPage from "../../pages/ws";
import UserService from "../../services/userService";
import WsEditorService from "../../services/wsEditorService";
import app from "../app";

class WsEditorPage extends WsPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wssettings.editor";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wssettings/wsEditor.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/editor",
        resolve: {
            wsEditorService: [WsEditorService.IID, (wsEditorService: WsEditorService) => {
                return wsEditorService.load().then((service) => service);
            }],
        },
    };

    public isSettingsOpen: boolean = true;

    public get dummyStudentOwner() {
        return UserService.DummyStudentOwner;
    }

    public get dummyStudentSameGroup() {
        return UserService.DummyStudentSameGroup;
    }

    public get dummyStudentSameCourse() {
        return UserService.DummyStudentSameCourse;
    }

}

WsEditorPage.register(app.getModule());
