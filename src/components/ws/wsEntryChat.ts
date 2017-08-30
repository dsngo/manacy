import Models from "./../../models/models";
import WsElementBase from "./wsElementBase";

export default class WsEntryChat extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryChat";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryChat.html";
    }

    public entryForm: angular.IFormController;
    public textEntry: string;

    /**
     * Filter用関数を返すGetter Property
     * Angular Filter関数はスコープを持たずにコールされる（this = undefinedになる）
     * そのため、クロージャを都度生成してそれを返すプロパティとして実装する
     */
    public get entryFilter() {
        // thisを保存
        const thisComponent = this;

        return (entry: Models.Dtos.WsEntryDto, index, array): boolean => {
            return thisComponent.wsAssignmentService.CheckEntryEnable(entry, thisComponent.ownerUserId, false);
        };
    }

    public onPostClick() {
        this.wsAssignmentService.postEntry(this.element, {
            wsEntryTypeId: Models.Worksheet.WsEntryTypeEnum.chat,
            ownerUserId: this.ownerUserId as number,
            assignmentId: this.wsAssignmentService.assignment.id,
            jsonData: JSON.stringify({ text: this.textEntry }),
            textData: this.textEntry,
        }).then(() => {
            this.textEntry = "";
            this.entryForm.$setPristine();
        });
    }

}
