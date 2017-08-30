import Models from "../../models/models";
import WsAssignmentService from "../../services/wsAssignmentService";
import WsElementBase from "./wsElementBase";

export default class WsElementDescription extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementDescription";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsElement.html";
    }

    /**
     * エレメントの表示／非表示制御
     */
    public get isVisible(): boolean {

        // Contentが存在しなければ非表示
        // if (!this.content) return false;

        // アクセスレベルがNoAccessならば非表示
        if (this.accessLevel === Models.AccessPermissionEnum.NoAccess) { return false; }

        return true;

    }

}
