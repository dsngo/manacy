import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";

export default class WsElementEditor extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementEditor";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings = {
            element: "<",
        };
        options.templateUrl = "../components/wsEditor/wsElementEditor.html";
        options.transclude = true;
    }

    /**
     * BindingされたWsElementId
     */
    public element: Models.Dtos.WsElementDto;

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, WsEditorService.IID, "$mdDialog", "$scope"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public wsEditorService: WsEditorService,
        public $mdDialog: ng.material.IDialogService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    /**
     * Element.Contentを取得
     */
    public get content(): Models.Dtos.WsElementContentDto {
        // エレメント追加時にエレメントが描画されない不具合の8末暫定対応
        // TODO ちゃんと原因調査して根本対応で不要になった場合は削除
        if (!this.element) { return null; }

        return this.element.content || null;
    }

    public onFocus(): void {
        this.wsEditorService.activeElement = this.element;
    }

    public onQuillSelectionChanged(editor, range, oldRange, source) {
        if (oldRange == null) { this.onFocus(); }
    }

    public get isSelected(): boolean {
        if (this.wsEditorService.activeElement && this.element) {
            return this.wsEditorService.activeElement === this.element;
        }
        return false;
    }

    public save() {
        this.wsEditorService.save();
    }

    public cancel() {
        this.wsEditorService.cancelChange();
    }

    public remove() {
        const confirm = this.$mdDialog.confirm()
            .title("要素の削除")
            .textContent("選択されている要素は削除されます。その要素に含まれる子要素も全て削除されます。")
            .ok("削除する")
            .cancel("キャンセル");

        this.$mdDialog.show(confirm).then(() => {
            this.wsEditorService.deleteElement()
            .then(() => this.$scope.$root.$broadcast("element:add/delete"));
        }, () => {
            return;
        });
    }
}
