import Models from "./../../models/models";
import WsElementBase from "./wsElementBase";

export default class WsEntrySelection extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntrySelection";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntrySelection.html";
    }

    /**
     * Filter用関数を返すGetter Property
     * Angular Filter関数はスコープを持たずにコールされる（this = undefinedになる）
     * そのため、クロージャを都度生成してそれを返すプロパティとして実装する
     */
    public get entryFilter() {
        // thisを保存
        const thisComponent = this;

        return (entry: Models.Dtos.WsEntryDto, index, array): boolean => {
            // 記入可能の場合、自分自身の書込は表示しない（入力欄に表示する）
            if (entry.createUserId === thisComponent.currentUser.id && this.accessLevel === 2) { return false; }
            // 共有レベルのチェック
            return thisComponent.wsAssignmentService.CheckEntryEnable(entry, thisComponent.ownerUserId, true);
        };
    }

    public get selections(): WsEntry.ISelectionItem[] {
        return this.element.content.entrySettings.selection.items;
    }

}
