import Models from "../../models/models";
import WsListService from "../../services/wsListService";
import ComponentBase from "../componentBase";

export default class WsList extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsList";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings = {
            wsList: "=",
            isDraft: "<",
        };
        options.templateUrl = "../components/wslist/wsList.html";
    }

    /**
     * InjectするService
     */
    public static $inject = [WsListService.IID];

    /**
     * コンストラクタ
     * @param wsService
     */
    public constructor(
        public wsListService: WsListService,
    ) {
        super();
    }

    public wsList: Models.Dtos.WsDto[];

    /**
     * 「削除」押下時処理
     * @param  wsId
     */
    public deleteWs(wsIndex: number) {
        this.wsListService.delete(this.wsList[wsIndex].wsElementId);
        this.wsList.splice(wsIndex, 1);
    }

}
