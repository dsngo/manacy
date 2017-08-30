import * as uiRouter from "angular-ui-router";
import Models from "../../models/models";
import AuthorizedPage from "../../pages/authorizedPage";
import WsService from "../../services/wsService";
import app from "../app";

export default class WsSettingsPage extends AuthorizedPage {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.wssettings";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./wssettings/wssettings.html";
    }

    /**
     * bindings変数リストにResolvedを追加する
     * @param options
     */
    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, WsSettingsPage.state);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
    {
        url: "/ws/{wsId:[0-9]{1,}}/settings",
        abstract: true,
        resolve: {
            wsService: [WsService.IID, "$transition$", "$q", (wsService: WsService, $transition$: uiRouter.Transition, $q: ng.IQService) => {
                const wsId = $transition$.params().wsId;
                return $q.all([wsService.load(wsId)]).then(() => wsService);
            }],
            $state: ["$state", ($state) => $state],
        },
    };

    /**
     * インジェクトするサービス
     */
    public static $inject = ["$location"];

    /**
     * コンストラクタ
     */
    public constructor(

        public $location,
    ) {
        super($location);
    }

    public wsService: WsService;
    public $state: uiRouter.StateService;
    public currentNav: string;
    protected $onInit(): void {
        this.$scope.$watch("$ctrl.$state.current.name", () => {
            this.currentNav = this.$state.current.name;
        });
    }

    public $transition$: uiRouter.Transition;
    public wsList: Models.Dtos.WsDto[];

    /**
     * 「削除」押下時処理
     * @param  wsId
     */
    public deleteWs() {
        this.wsService.delete(this.wsService.ws.wsElementId).then((res) => {
        this.$location.path("ws/mine");
        });
    }

}

WsSettingsPage.register(app.getModule());
