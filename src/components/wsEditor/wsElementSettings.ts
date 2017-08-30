import * as _ from "lodash";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";

export default class WsElementSettings extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementSettings";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
        };
        options.templateUrl = "../components/wsEditor/wsElementSettings.html";
    }

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, WsEditorService.IID];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public wsEditorService: WsEditorService,
    ) {
        super();
    }

    public get element(): Models.Dtos.WsElementDto {
        return this.wsEditorService.activeElement;
    }

    public get property(): Models.Dtos.WsElementPropertyDto {
        return this.wsEditorService.activeElement.property;
    }

    public get origin(): Models.Dtos.WsOriginDto {
        return this.wsEditorService.activeElement.origin;
    }

    /**
     * Element.Contentを取得
     */
    public get content(): Models.Dtos.WsElementContentDto {
        return this.wsEditorService.activeElement.content;
    }

    public get settings(): WsEntry.ISettings {
        return this.wsEditorService.activeElement.content.entrySettings;
    }

}
