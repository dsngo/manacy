import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import AppDialog from "../appDialog";

export default class WsSelectOrigins extends AppDialog {
    // /**
    //  * 登録コンポーネント名
    //  */
    // public static readonly IID: string = 'appWsSelectOrigin';

    // /**
    //  * コンポーネントオプション
    //  */
    // protected static setOptions(options: ng.IComponentOptions) {
    //     options.templateUrl = '../components/wsEditor/wsSelectOrigins.html';
    // }

    /**
     * InjectするService
     */
    public static $inject = ["$mdDialog", WsEditorService.IID];

    public selectedCategory: Models.Dtos.WsOriginCategoryDto = null;

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public $mdDialog: ng.material.IDialogService,
        public wsEditorService: WsEditorService,
    ) {
        super($mdDialog);
    }

    /**
     * 呼び出し元からdatabindされる
     * 例）dialogOption.locals = { parentElement: this.baseElement };
     */
    public parentElement: Models.Dtos.WsElementDto;

    /**
     * ダイアログ表示設定を返す
     * @param
     */
    public static getDialogOptions($event): ng.material.IDialogOptions {
        const options = super.getDialogOptions($event);
        options.templateUrl = "../components/wsEditor/wsSelectOrigins.html";
        options.fullscreen = true;
        return options;
    }

    public onSelectCategory(category: Models.Dtos.WsOriginCategoryDto) {
        this.selectedCategory = category;
    }

    public onSelectOrigin(origin: Models.Dtos.WsOriginDtoForEditor): void {
        this.hide(origin);
    }
}
