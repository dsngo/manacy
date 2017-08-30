import * as angular from "angular";
import * as uiRouter from "angular-ui-router";
import app from "../../app";
import Constants from "./../../../models/const";
import Models from "./../../../models/models";
import AssignmentSettings from "./assignmentSettings";
export default class AssignmentEditProperties extends AssignmentSettings {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "auth.assginment.settings.properties";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "./assignment/settings/assignmentProperties.html";
    }

    /**
     * インジェクトするサービス
     */
    public static $inject = ["$location", "$state"];

    /**
     * コンストラクタ
     */
    public constructor(
        public $location,
        public $state,
    ) {
        super($location);
    }

    /**
     * ui-uiRouterにおけるstate
     */
    public static readonly state: uiRouter.Ng1StateDeclaration =
        {
            url: "/properties",
        };

    private directories;
    private wsAssignmentDto: Models.Dtos.WsAssignmentDto;
    private lessonDate: Date;

    protected $onInit(): void {
        this.init();
        this.wsAssignmentService.loadDirectories().then(() => {
            this.directories = angular.copy(this.wsAssignmentService.directories);
            this.directories.forEach((directory) => directory.path = directory.path.replace(/\//g, " "));
        });
    }

    private init(): void {
        this.wsAssignmentDto = angular.copy(this.wsAssignmentService.assignment);
        this.lessonDate = this.wsAssignmentDto.lessonDate === Constants.MAX_DATE_STR ? null : new Date(this.wsAssignmentDto.lessonDate);
    }

    private onSave(): void {
        this.wsAssignmentDto.lessonDate = this.lessonDate ? this.lessonDate.toISOString() : Constants.MAX_DATE_STR;
        this.wsAssignmentService.updateAssignments(this.wsAssignmentDto).then(() => {
            // alert("put success!!");
        });
    }

    private onCancel(): void {
        this.init();
    }

    /**
     * テンプレートHTMLを共有するため、表示切り替え用にフラグを渡す
     * true:ワークシート配付設定（編集）
     * @returns {boolean}
     */
    private isEdit(): boolean {
        return true;
    }
}

AssignmentEditProperties.register(app.getModule());
