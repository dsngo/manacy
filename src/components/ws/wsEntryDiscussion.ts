import Models from "./../../models/models";
import WsElementBase from "./wsElementBase";

export default class WsEntryDiscussion extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryDiscussion";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntryDiscussion.html";
    }

    public entries: WsEntry.IEntryCollection = {};
    public topicForm: angular.IFormController;
    public topicTitle: string;
    public topicText: string;
    public commentForm: angular.IFormController;
    public commentText: string;

    protected onLoad(): void {
        // entriesを初期化
        this.getEntries(Models.Worksheet.WsEntryTypeEnum.discussion).forEach((entry) => {
            if (this.wsAssignmentService.CheckEntryEnable(entry, this.ownerUserId)) {
                this.initEntry(entry);
            }
        });
    }

    private initEntry(entry: Models.Dtos.WsEntryDto) {
        const parentId = entry.jsonData.parentId || 0;
        if (!this.entries[parentId]) {
            this.entries[parentId] = [];
        }
        if (this.entries[parentId].indexOf(entry) === -1) {
            this.entries[parentId].push(entry);
        }
    }

    public onTopicPost() {
        this.wsAssignmentService.postEntry(this.element, {
            wsEntryTypeId: Models.Worksheet.WsEntryTypeEnum.discussion,
            ownerUserId: this.ownerUserId as number,
            assignmentId: this.wsAssignmentService.assignment.id,
            jsonData: JSON.stringify({
                parentId: null,
                title: this.topicTitle,
                text: this.topicText,
            }),
            textData: this.topicText,
        }).then((entry) => {
            this.topicTitle = "";
            this.topicText = "";
            this.topicForm.$setPristine();
            this.initEntry(entry);
        });
    }

    public onCommentPost(parentId: DtoIdType) {
        this.wsAssignmentService.postEntry(this.element, {
            wsEntryTypeId: Models.Worksheet.WsEntryTypeEnum.discussion,
            ownerUserId: this.ownerUserId as number,
            assignmentId: this.wsAssignmentService.assignment.id,
            jsonData: JSON.stringify({
                parentId,
                text: this.commentText,
            }),
            textData: this.commentText,
        }).then((entry) => {
            this.commentText = "";
            this.commentForm.$setPristine();
            this.initEntry(entry);
        });
    }

}
