import Models from "../../models/models";
import IdentityService from "../../services/IdentityService";
import ComponentBase from "../componentBase";

export default class WsUsersNav extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsUsersNav";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings = {
            userGroups: "<",
            selectedUserId: "<",
            onClick: "&",
        };
        options.templateUrl = "../components/ws/wsUsersNav.html";
    }

    /**
     * InjectするService
     */
    public static $inject = [IdentityService.IID, "$scope"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public identityService: IdentityService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    public selectedUserId: DtoIdType;
    public userGroups: Ws.IUserGroups;

    /**
     * 初期化処理
     */
    protected $onInit(): void {
        this.onLoad();
        this.$scope.$watch(() => JSON.stringify(this.userGroups), () => {
            this.onLoad();
        });
    }

    public groups: Array<{ name: string; users: Models.Dtos.DisplayUserDto[] }>;

    protected onLoad() {
        this.groups = [];
        for (const key in this.userGroups) {
            if (this.userGroups.hasOwnProperty(key)) {
                this.groups.push({
                    name: key,
                    users: this.userGroups[key],
                });
            }
        }
    }

    public containsStudents(users: Models.Dtos.DisplayUserDto[]) {
        return users.some((value) => value.student !== null);
    }

    /**
     * 現在ログイン中のユーザー
     */
    public get currentUser(): Models.Dtos.UserDto {
        // 現在ログイン中のユーザーを取得する
        return this.identityService.currentUser;
    }

}
