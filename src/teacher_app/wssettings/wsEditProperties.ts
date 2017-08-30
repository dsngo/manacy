import * as angular from "angular";
import * as uiRouter from "angular-ui-router";
import app from "../app";
import constants from "./../../models/const";
import Models from "./../../models/models";
// import IWsPropertiesController from "./WsPropertiesBase";
import WsSettings from "./wssettings";

// export default class WsEditProperties extends NewWs implements IWsPropertiesController {
export default class WsEditProperties extends WsSettings {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wssettings.properties";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wssettings/wsProperties.html";
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/properties",
        };

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
    public wsDto;
    public semesters;
    private titleMaxLength: number = constants.MAX_LEN_NAME;
    private memoMaxLength: number = constants.MAX_LEN_NVARCHAR;
    private isEdit: boolean = true;

    protected $onInit(): void {

        this.wsDto = angular.copy(this.wsService.ws);
    }

    public onSave(): void {
        this.wsService.updateWs(this.wsDto).then(() => {
            this.wsService.loadWs(this.wsDto.wsElementId).then(() => {
                this.wsDto = angular.copy(this.wsService.ws);
            });
        });
    }

    private onCancel(): void {
        this.wsDto = angular.copy(this.wsService.ws);
    }
}

WsEditProperties.register(app.getModule());
