import * as angular from "angular";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import ComponentBase from "../componentBase";

export default class WsOriginCategoryNav extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsOriginCategoryNav";

    /**
     * InjectするService
     */
    public static $inject = [WsEditorService.IID];

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            selectedCategory: "<",
            onClick: "&",
        };
        options.templateUrl = "../components/wsEditor/wsOriginCategoryNav.html";
    }

    public selectedCategory: Models.Dtos.WsOriginCategoryDto;
    public rootCategories: Models.Dtos.WsOriginCategoryDto[];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsEditorService: WsEditorService,
    ) {
        super();
    }

    protected $onInit(): void {
        this.rootCategories = this.wsEditorService.originCategoryArray.filter((category, index, array) => {
            return category.parentId === null &&
                category.accessLevel !== Models.AccessLevelEnum.Private &&
                category.categoryType === Models.Worksheet.WsOriginCategoryTypeEnum.Basic;
        });
    }

    public get categories() {
        return this.wsEditorService.originCategoryArray;
    }

    public hasChildren(category: Models.Dtos.WsOriginCategoryDto) {
        return this.categories.find((value, index) => value.parentId === category.id);
    }
}
