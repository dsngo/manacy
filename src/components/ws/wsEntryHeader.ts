import UserService from "../../services/userService";
import WsAssignmentService from "../../services/wsAssignmentService";
import ComponentBase from "../componentBase";

export default class WsEntryHeader extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryHeader";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.bindings = {
            authorId: "<",
            ownerId: "<",
        };
        options.templateUrl = "../components/ws/wsEntryHeader.html";
        options.transclude = true;
    }

    public authorId: DtoIdType;
    public ownerId: DtoIdType;

    /**
     * InjectするService
     */
    public static $inject = [WsAssignmentService.IID, UserService.IID];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     * @param userService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public userService: UserService,
    ) {
        super();
    }

    public get authorName() {
        return this.authorId ? this.userService.getDisplayName(this.authorId) : "";
    }

    public get ownerName() {
        return this.ownerId ? this.userService.getDisplayName(this.ownerId) : "";
    }

    public get isSelfEntry() {
        // tslint:disable-next-line:triple-equals
        return this.authorId == this.ownerId;
    }

}
