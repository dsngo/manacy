
import IdentityService from "../../services/IdentityService";
import uploadService from "../../services/uploadService";
import ComponentBase from "../componentBase";
import Models from "./../../models/models";

// ユーザインタフェース
interface IUser {
    name: string;
    password: string;
    passwordForConfirmation: string;
    mail: string;
    color: string;
}

export default class UserSettings extends ComponentBase {

    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appUserSettings";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/user/userSettings.html";
        options.bindings = {
            user: "=",
        };
    }

    // Inject Services
    public static $inject = [IdentityService.IID, uploadService.IID, "$scope"];

    /**
     * コンストラクタ
     */
    public constructor(
        private identityService: IdentityService,
        private UploadService: uploadService,
        public $scope: ng.IScope,
    ) {
        super();
    }

    // ユーザ情報
    public userInfo: IUser = {
        name: "",
        password: "",
        passwordForConfirmation: "",
        mail: "",
        color: "",
    };

    // カラーバリエーション
    public colors: object[] = [{ key: "default", name: "デフォルト" }, { key: "blue", name: "ブルー" }, { key: "yellow", name: "イエロー" }, { key: "red", name: "レッド" }];

    public image: File;
    public imageUrl: string;

    /**
     * 初期化処理
     */
    public $onInit(): void {
        this.$scope.$watch(
            () => this.userInfo.color,
            () => this.setTheme(),
        );
        this.resetUserInfo();
    }

    public cancel(): void {
        this.resetUserInfo();
    }

    public edit(): void {
        this.identityService.currentUser.displayName = this.userInfo.name;
        this.identityService.currentUser.email = this.userInfo.mail;
        this.UploadService.uploadAvatar(this.image);
    }

    public resetUserInfo(): void {

        this.userInfo = {
            name: this.identityService.currentUser.displayName,
            password: "",
            passwordForConfirmation: "",
            mail: this.identityService.currentUser.email,
            color: "",
        };
    }

    public changeAvatar(file: File): void {
        if (file == null) {
            return;
        }

        this.image = file;
        const reader = new FileReader();
        reader.onload = () => {
            const setter = () => {
                this.imageUrl = reader.result;
            };
            this.$scope.$evalAsync(setter);
        };

        reader.readAsDataURL(file);
    }

    public setTheme(): void {
        this.$scope.$emit("setTheme", this.userInfo.color);
    }

}
