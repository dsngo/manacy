import * as angular from "angular";
import * as uiRouter from "angular-ui-router";
import WsAssignmentService from "../../../services/wsAssignmentService";
import app from "../../app";
import NewAssignment from "../newAssignment";
import Constants from "./../../../models/const";
import Models from "./../../../models/models";
export default class AssignmentProperties extends NewAssignment {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.newassignment.properties";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./assignment/settings/assignmentProperties.html";
    }

    /**
     * インジェクトするサービス
     */
    public static $inject = ["$location", "$stateParams"];

    /**
     * コンストラクタ
     */
    public constructor(
        public $location,
        public $stateParams,
    ) {
        super($location);
    }

    protected static setInheritOptions(options: ng.IComponentOptions): void {
        super.setInheritOptions(options);
        this.setResolveBindings(options, AssignmentProperties.state);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/settings/properties?wsId",
            resolve: {
                wsAssignmentService: [WsAssignmentService.IID, "$stateParams", "$q",
                    (wsAssignmentService: WsAssignmentService, $stateParams, $q: ng.IQService) => {
                        // TODO 存在しないwsIdが入ってきた場合のハンドリングが必要
                        const wsId =  $stateParams.wsId;
                        return $q.all([wsAssignmentService.loadWs(wsId), wsAssignmentService.loadDirectories()]).then(() => wsAssignmentService);
                    }],
            },
        };

    private wsAssignmentService: WsAssignmentService;
    private directories: Models.Dtos.DirectoryDto[];
    private wsAssignmentDto: Models.Dtos.WsAssignmentDto;
    private lessonDate: Date;

    protected $onInit(): void {
        this.directories = angular.copy(this.wsAssignmentService.directories);
        this.directories.forEach((directory) => directory.path = directory.path.replace(/\//g, " "));
    }

    /**
     * assignment作成
     */
    private onSave(): void {
        this.wsAssignmentDto.lessonDate = this.lessonDate ? this.lessonDate.toISOString() : Constants.MAX_DATE_STR;
        this.wsAssignmentDto.wsElementId = this.$stateParams.wsId;
        this.wsAssignmentService.createAssignments(this.wsAssignmentDto).then(() => {
            this.$location.search("wsId", null);
            this.$location.path("/assignments/" + this.wsAssignmentService.assignment.id + "/settings/users");
        });
    }

    /**
     * テンプレートHTMLを共有するため、表示切り替え用にフラグを渡す
     * true:ワークシート配付設定（編集）
     * @returns {boolean}
     */
    private isEdit(): boolean {
        return false;
    }
}

AssignmentProperties.register(app.getModule());
