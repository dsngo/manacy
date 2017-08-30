import Models from "./../../models/models";
import WsElementBase from "./wsElementBase";

export default class WsEntrySelectionInput extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntrySelectionInput";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings["hideHeader"] = "<";
        options.templateUrl = "../components/ws/wsEntrySelectionInput.html";
    }

    public hideHeader: boolean;

    public selectedIndex: number;
    public selectedItems: boolean[] = [];

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        super.$onInit();
        this.$scope.$watch(
            () => this.selectedIndex,
            () => this.validate());
        this.$scope.$watch(
            // 全てのチェックボックスの合計値(true:1/false:0として)で、変更を検出する
            () => this.selectedItems.reduce((prev, curr, index, arr) => curr ? prev + 1 : prev, 0),
            () => this.validate());

        this.registerSaveEvent();
    }

    protected onLoad() {
        if (this.isSingleSelection) {
            this.selectedIndex = this.myEntryData[0];
        } else {
            this.selectedItems = [];
            this.myEntryData.forEach((index) => {
                this.selectedItems[index] = true;
            });
        }
    }

    /**
     * 選択肢の配列
     */
    public get selections(): WsEntry.ISelectionItem[] {
        return this.content.entrySettings.selection ? this.element.content.entrySettings.selection.items : [];
    }

    /**
     * ログインしているユーザーの現在のentryを返す。entryが存在しなければ[null]を返す
     */
    protected get myEntryData(): number[] {
        const entry = this.getMySingleEntry(Models.Worksheet.WsEntryTypeEnum.selection);
        if (entry) {
            return entry.jsonData.selectedIndex;
        }
        return [null];
    }

    /**
     * 択一か複数選択可能かどうか。
     */
    public get isSingleSelection(): boolean {
        const selection = this.element.content.entrySettings.selection;
        if (selection && selection.maxSelections) {
            return selection.maxSelections === 1 && selection.minSelections === 1;
        }
        return true;
    }

    /**
     * Checkbox or radiobutton を右側に配置するかどうか。
     */
    public get isPositionRihght(): boolean {
        const selection = this.element.content.entrySettings.selection;
        if (selection && selection.isShowRight) {
            return selection.isShowRight
        }
        return false;
    }

    /**
     *
     */
    public get isShowBorder(): boolean {
        const selection = this.element.content.entrySettings.selection;
        if (selection && selection.isShowBorder) {
            return selection.isShowBorder
        }
        return false;
    }

    /**
     * 現在選択している選択肢の数
     */
    public get selectedCount(): number {
        if (this.isSingleSelection) {
            return this.selectedIndex === null ? 0 : 1;
        } else {
            return this.selectedItems.reduce((prev, curr, index, array) => {
                if (curr) {
                    return prev + 1;
                }
                return prev;
            }, 0);
        }
    }

    /**
     * 指定されたindexの選択肢が選択されているかどうか
     * @param index
     */
    public isSelected(index: number) {
        if (this.isSingleSelection) {
            return index === this.selectedIndex;
        } else {
            return this.selectedItems[index];
        }
    }

    /**
     * 選択肢md-list-itemクリック時
     * @param index
     */
    public onItemClick(index: number) {
        if (this.isSingleSelection) {
            this.selectedIndex = index;
        } else {
            if (this.selectedItems[index]) {
                this.selectedItems[index] = false;
            } else {
                if (this.selectedCount < this.content.entrySettings.selection.maxSelections) {
                    this.selectedItems[index] = true;
                }
            }
        }
    }

    /**
     * Checkboxクリック時のバリデーション
     * @param index
     */
    public onChkClick(index: number) {
        if (!this.selectedItems[index]) {
            if (this.selectedCount >= this.content.entrySettings.selection.maxSelections) {
                // trueに設定すると、なぜかfalseのままになる。
                this.selectedItems[index] = true;
            }
        }
    }

    /**
     * バリデーション
     */
    public isValid() {
        const count = this.selectedCount;
        return count >= this.content.entrySettings.selection.minSelections &&
            count <= this.content.entrySettings.selection.maxSelections;
    }

    /**
     * 変更されているかどうか
     */
    public isDirty(): boolean {
        const entry = this.myEntryData;
        if (this.isSingleSelection) {
            return this.selectedIndex !== entry[0];
        } else {
            return !this.selectedItems.every((value, index, arr) => {
                const exist = entry.indexOf(index) !== -1;
                return value ? exist : !exist;
            });
        }
    }

    /**
     * 保存処理イベントハンドラ
     */
    protected onElementSave() {
        const selectedIndex = [];

        if (this.isSingleSelection) {
            selectedIndex[0] = this.selectedIndex;
        } else {
            this.selectedItems.forEach((value, index) => {
                if (value) {
                    selectedIndex.push(index);
                }
            });
        }

        this.wsAssignmentService.postEntry(this.element, {
            wsEntryTypeId: Models.Worksheet.WsEntryTypeEnum.selection,
            ownerUserId: this.ownerUserId as number,
            assignmentId: this.wsAssignmentService.assignment.id,
            jsonData: JSON.stringify({
                selectedIndex,
            }),
            textData: this.isSingleSelection ? this.selectedIndex.toString() : this.selectedItems.toString(),
        }).then((entry) => {
            return;
        });
    }

}
