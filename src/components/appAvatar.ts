import UserService from "../services/userService";
import ComponentBase from "./componentBase";

export default class AppAvatar extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appAvatar";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings = {
            userId: "<",
            small: "<",
        };
        options.templateUrl = "../components/appAvatar.html";
    }

    public userId: DtoIdType;

    public static $inject = [UserService.IID];

    public constructor(
        public userService: UserService,
    ) {
        super();
    }

    public get avatarUrl() {
        return AVATAR_PATH;
    }

    public get displayName() {
        return this.userService.getDisplayName(this.userId);
    }

}
