import * as _ from "lodash";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import WsAssignmentService from "../../services/wsAssignmentService";
import WsElementSettingsSelection from "./wsElementSettingsSelection";

export default class WsElementSettingsRubric extends WsElementSettingsSelection {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementSettingsRubric";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/wsEditor/wsElementSettingsRubric.html";
    }

    public get textEnabled() {
        return "text" in this.settings;
    }
    public set textEnabled(value) {
        if (value) {
            this.settings.text = {};
        } else {
            delete this.settings.text;
        }
    }

}
