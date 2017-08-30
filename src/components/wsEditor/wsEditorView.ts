import WsService from "../../services/wsService";
import ComponentBase from "../componentBase";

export default class WsEditorView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEditorView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            ownerUserId: "<",
        };
        options.templateUrl = "../components/wsEditor/wsEditorView.html";
    }

    /**
     * InjectするService
     */
    public static $inject = [WsService.IID];

    /**
     * コンストラクタ
     * @param wsService
     */
    public constructor(
        public wsService: WsService,
    ) {
        super();
    }

    /**
     * WSが白紙かどうか
     */
    public get isBlank() {
        return this.wsService.getChildElements(this.wsService.rootElement).length === 0;
    }

}
