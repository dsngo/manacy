import * as angular from "angular";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import ComponentBase from "../componentBase";

export default class WsOriginList extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsOriginList";

    /**
     * InjectするService
     */
    public static $inject = [WsEditorService.IID];

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            category: "<",          // 指定した場合、そのカテゴリー中に含まれるOriginを表示する
            parentElement: "<",     // 指定した場合、そのelement originのルール上挿入可能なoriginを表示する
            onClick: "&",
        };
        options.templateUrl = "../components/wsEditor/wsOriginList.html";
    }

    public category: Models.Dtos.WsOriginCategoryDto;
    public parentElement: Models.Dtos.WsElementDto;

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsEditorService: WsEditorService,
    ) {
        super();
    }

    public get origins() {
        return this.wsEditorService.originArray;
    }

    public getOrigin(id: DtoIdType): Models.Dtos.WsOriginDtoForEditor {
        return this.wsEditorService.originBy[id];
    }

    public getOriginCategory(origin: Models.Dtos.WsOriginDtoForEditor): Models.Dtos.WsOriginCategoryDto {
        return this.wsEditorService.originCategoryBy[origin.wsOriginCategoryId];
    }

    /**
     * Filter用関数を返すGetter Property
     * Angular Filter関数はスコープを持たずにコールされる（this = undefinedになる）
     * そのため、クロージャを都度生成してそれを返すプロパティとして実装する
     */
    public get originFilter() {
        // メンバ変数を保存
        const category = this.category;
        const rules = this.parentElement ? this.wsEditorService.originBy[this.parentElement.originId].rules : null;

        return (origin: Models.Dtos.WsOriginDto, index, array): boolean => {
            return category ? origin.wsOriginCategoryId === category.id :
                rules ? rules.find((rule) => rule.optionalOriginId === origin.wsElementId) !== undefined : false;
        };
    }

}
