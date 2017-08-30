import * as uiRouter from "angular-ui-router";
import WsPage from "../../pages/ws";
import UserService from "../../services/userService";
import WsEditorService from "../../services/wsEditorService";
import app from "../app";

class WsPreviewPage extends WsPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wssettings.preview";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wssettings/wsPreview.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/preview",
        resolve: {
            wsEditorService: [WsEditorService.IID, (wsEditorService: WsEditorService) => {
                return wsEditorService.load().then((service) => service);
            }],
        },
    };

    public isSettingsOpen: boolean = true;
    public selected: number = -9999;

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

WsPreviewPage.register(app.getModule());
