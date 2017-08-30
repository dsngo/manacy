import IdentityService from "../../services/IdentityService";
import UserService from "../../services/userService";
import WsAssignmentService from "../../services/wsAssignmentService";
import Models from "./../../models/models";
import WsEntryHelper from "./../../models/wsEntryHelper";
import WsElementBase from "./wsElementBase";
import WsEntryMediaDialog from "./wsEntryMediaDialog";

export default class WsEntryMedia extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryMedia";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        // tslint:disable-next-line:no-unused-expression
        options.bindings["entries"] = "<";
        options.templateUrl = "../components/ws/wsEntryMedia.html";
        options.transclude = true;
    }

    /**
     * entry配列
     */
    public entries: WsEntry.EntryArray;

    /**
     * InjectするService
     */
    public static $inject =
    [WsAssignmentService.IID, UserService.IID, IdentityService.IID, "$scope", "$mdMedia", "$mdDialog"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public userService: UserService,
        public identityService: IdentityService,
        public $scope: ng.IScope,
        public $mdMedia: ng.material.IMedia,
        public $mdDialog: ng.material.IDialogService,
    ) {
        super(wsAssignmentService, userService, identityService, $scope);
    }

    protected onLoad() {
        const a = 1;
    }

    public get entryFilter() {
        return (value: Models.Dtos.WsEntryDto, index: number, array: WsEntry.EntryArray): boolean => {
            return (
                WsEntryHelper.isImage(value) ||
                WsEntryHelper.isVideo(value) ||
                WsEntryHelper.isAudio(value) ||
                WsEntryHelper.isFile(value)
            );
        };
    }

    /**
     * WsEntryHelperを$ctrlで使う
     */
    public readonly helper = WsEntryHelper;

    public get gridCols() {
        return this.$mdMedia("xs") ? 2 : 4;
    }

    public getColSpan(entry: Models.Dtos.WsEntryDto, index: number) {
        switch (entry.wsEntryTypeId) {
            case Models.Worksheet.WsEntryTypeEnum.image:
                if (entry.jsonData.width < entry.jsonData.height) {
                    return index === 0 ? 2 : 1;
                }
                return index === 0 ? this.gridCols : 2;

            case Models.Worksheet.WsEntryTypeEnum.video:
            case Models.Worksheet.WsEntryTypeEnum.audio:
                return this.gridCols;

            case Models.Worksheet.WsEntryTypeEnum.text:
                return 2;

            default:
                break;
        }
    }

    public getRowSpan(entry: Models.Dtos.WsEntryDto, index: number) {
        switch (entry.wsEntryTypeId) {
            case Models.Worksheet.WsEntryTypeEnum.image:
            case Models.Worksheet.WsEntryTypeEnum.video:
                return Math.round(
                    (this.getColSpan(entry, index) * entry.jsonData.height * 8) / (entry.jsonData.width * 3));

            case Models.Worksheet.WsEntryTypeEnum.audio:
                return 1;

            case Models.Worksheet.WsEntryTypeEnum.text:
                return 1;

            default:
                break;
        }
    }

    public showDialog($event, $index): void {
        const thisComponent = this;

        // parentElementパラメーターをダイアログに渡す
        const dialogOption = WsEntryMediaDialog.getDialogOptions($event);
        dialogOption.locals = { entries: this.entries, index: $index };

        this.$mdDialog.show(dialogOption);

    }
}
