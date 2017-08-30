import Models from "./../../models/models";
import WsElementBase from "./wsElementBase";

export default class WsItemSingleEntry extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryBasic";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryBasic.html";
        options.transclude = true;
    }

    /**
     * entry author をキーとした連想配列
     */
    public entries: WsEntry.IEntryCollection = {};

    public myEntries: WsEntry.EntryArray = [];

    protected onLoad(): void {
        this.entries = {};
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.text, true);
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.video);
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.image);
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.audio);
        this.addEntryByAuthor(this.entries, Models.Worksheet.WsEntryTypeEnum.file);

        // 自分自身のentryを切り分けておく
        this.myEntries = this.entries[this.currentUser.id];
        delete this.entries[this.currentUser.id];
    }

    public hasMedia(entries: WsEntry.EntryArray) {
        return entries.some((entry) =>
            entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.image ||
            entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.video ||
            entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.audio ||
            entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.file);
    }

    // /**
    //  * Filter用関数を返すGetter Property
    //  * Angular Filter関数はスコープを持たずにコールされる（this = undefinedになる）
    //  * そのため、クロージャを都度生成してそれを返すプロパティとして実装する
    //  */
    // public get textEntryFilter() {
    //     // thisを保存
    //     const thisComponent = this;

    //     return (entry: Models.Dtos.WsEntryDto, index, array): boolean => {
    //         // text型でなければfalse
    //         if (entry.wsEntryTypeId !== Models.Worksheet.WsEntryTypeEnum.text) { return false; }
    //         // 記入可能の場合、自分自身の書込は表示しない（入力欄に表示する）
    //         if (entry.createUserId === thisComponent.currentUser.id && this.accessLevel === 2) { return false; }
    //         // 共有レベルのチェック
    //         return thisComponent.wsAssignmentService.CheckEntryEnable(entry, thisComponent.ownerUserId, true);
    //     };
    // }

    // public get fileEntryFilter() {
    //     // thisを保存
    //     const thisComponent = this;

    //     return (entry: Models.Dtos.WsEntryDto, index, array): boolean => {
    //         // text型ならばfalse
    //         if (entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.text) { return false; }
    //         // 共有レベルのチェック
    //         return thisComponent.wsAssignmentService.CheckEntryEnable(entry, thisComponent.ownerUserId, false);
    //     };
    // }

}
