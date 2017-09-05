import DrawService from "./drawService";
import IdentityService from "./IdentityService";
import UploadService from "./uploadService";
import UserService from "./userService";
import WsAssignmentService from "./wsAssignmentService";
import WsEditorService from "./wsEditorService";
import WsListService from "./wsListService";
import WsService from "./wsService";

export default function registerServices(app: ng.IModule) {
    DrawService.register(app);
    IdentityService.register(app);
    UploadService.register(app);
    UserService.register(app);
    WsAssignmentService.register(app);
    WsEditorService.register(app);
    WsListService.register(app);
    WsService.register(app);
}
