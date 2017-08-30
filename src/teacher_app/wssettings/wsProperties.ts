import * as angular from "angular";
import * as uiRouter from "angular-ui-router";
import WsService from "../../services/wsService";
import app from "../app";
import constants from "./../../models/const";
import Models from "./../../models/models";
import NewWs from "./newWs";
// import IWsPropertiesController from "./WsPropertiesBase";

// export default class WsProperties extends NewWs implements IWsPropertiesController {
export default class WsProperties extends NewWs {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.newws.properties";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wssettings/wsProperties.html";
    }

    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, WsProperties.state);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/properties?wsId",
            resolve: {
                wsService: [WsService.IID, "$stateParams", "$q", (wsService: WsService, $stateParams, $q: ng.IQService) => {
                    // TODO 存在しないwsIdが入ってきた場合のハンドリングが必要
                    // 暫定的にwsId: = 0:白紙のWSに置き換える
                    const wsId =  $stateParams.wsId || 0;
                    return $q.all([wsService.load(wsId)]).then(() => wsService);
                }],
            },
        };

    public wsService: WsService;
    public accessLevels =
        [
            {
                id : Models.AccessLevelEnum.Private,
                label: "下書き",
            },
            {
                id : Models.AccessLevelEnum.School,
                label: "自校の先生のみ公開",
            },
        ];
    public wsDto: Models.Dtos.WsDto;
    private titleMaxLength: number = constants.MAX_LEN_NAME;
    private memoMaxLength: number = constants.MAX_LEN_NVARCHAR;
    private isEdit: boolean = false;

    protected $onInit(): void {

        this.wsDto = angular.copy(this.wsService.ws);
        this.wsDto.sourceElementId = this.wsDto.wsElementId;
        this.wsDto.wsElementId = null;
    }

    public onSave(): void {
        this.wsService.createWs(this.wsDto).then((result) => {
            this.$location.search("wsId", null);
            this.$location.path("/ws/" + result.wsElementId + "/settings/editor");
        });
    }
}

WsProperties.register(app.getModule());
