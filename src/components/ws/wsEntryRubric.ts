import Models from "./../../models/models";
import WsElementBase from "./wsElementBase";

export default class WsEntryRubric extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryRubric";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryRubric.html";
    }

    /**
     * entry author をキーとした連想配列
     */
    public entries: WsEntry.IEntryCollection = {};

    protected onLoad(): void {
        this.entries = {};
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.selection, true);
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.text, true);

        // 自分自身のtext書込を削除しておく
        if (this.currentUser.id in this.entries) {
            delete this.entries[this.currentUser.id];
        }
    }

    public get selections(): WsEntry.ISelectionItem[] {
        return this.element.content.entrySettings.selection.items;
    }

}
