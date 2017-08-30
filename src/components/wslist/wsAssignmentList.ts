import WsAssignmentsService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";
import Constants from "./../../models/const";

export default class WsAssignmentList extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsAssignmentList";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/wslist/wsAssignmentList.html";
        options.bindings = {
            assignmentList: "=",
        };
    }

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentsService.IID];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentsService,
    ) {
        super();
    }

    public assignmentList;

    /**
     * 「今日の授業で使う」押下時処理
     * @param  assignment
     */
    public todayAssignment(assignment) {
        assignment.assignedDate = new Date().toISOString();
        this.wsAssignmentService.updateAssignments(assignment);
    }

    /**
     * 「削除」押下時処理
     * @param  index
     */
    public deleteAssignment(index) {
        this.wsAssignmentService.deleteAssignments(this.assignmentList[index].id);
        this.assignmentList.splice(index, 1);
    }

    /**
     * 「配付を中止する」押下時処理
     * @param  assignment
     */
    public cancelAssignment(assignment) {
        assignment.assignedDate = Constants.MAX_DATE_STR;
        this.wsAssignmentService.updateAssignments(assignment);
    }



}
