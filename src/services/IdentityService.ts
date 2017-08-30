import * as uiRouter from "angular-ui-router";
import * as restangular from "restangular";
import Models from "../models/models";
import ServiceBase from "./serviceBase";

export default class IdentityService extends ServiceBase {
    /**
     * 登録サービス名
     */
    public static readonly IID = "identityService";

    /**
     * インジェクトするサービス
     */
    public static $inject = ["Restangular", "$window", "$q", "$state"];

    /**
     * コンストラクタ
     */
    public constructor(
        protected Restangular: restangular.IService,
        protected $window: ng.IWindowService,
        protected $q: ng.IQService,
        protected $state: uiRouter.StateService,
    ) {
        super();
    }

    /**
     * ログイン中のユーザー情報
     */
    public currentUser: Models.Dtos.UserDto;

    /**
     * ログインする
     * @param username ユーザ名
     * @param password パスワード
     */
    public login(username: string, password: string): ng.IPromise<IdentityService> {
        this.busy(true);

        const request = this.Restangular.all("Token");

        // customPOSTで認証を試行する
        return request.customPOST(`grant_type=password&username=${username}&password=${password}`).then((result) => {

            this.authToken = result.access_token;

            return this.VerifySession();

        }).finally(() => {
            this.busy(false);
        });
    }

    /**
     * ログアウトする
     */
    public logoff(): void {
        this.removeToken();
        this.currentUser = null;
    }

    /**
     * ログイン状態を検証し、User情報を取得する。
     */
    public VerifySession(): ng.IPromise<IdentityService> {
        if (this.IsLoggedIn) {
            this.busy(true);
            this.SetBearerToken();
            const thisService = this;
            return this.Restangular.one("users", "Current").get().then((user) => {
                thisService.currentUser = user;
                return thisService;
            }).finally(() => {
                thisService.busy(false);
            });
        } else {
            const defered = this.$q.defer<IdentityService>();
            defered.reject("Not Logged In");
            return defered.promise;
        }
    }

    /**
     * 未ログイン状態でアクセスしようとしたStateをResume用に保存
     */
    public resumeState: uiRouter.StateDeclaration;
    public resumeStateParams: uiRouter.StateParams;

    /**
     * 未ログイン状態のためlogin画面にリダイレクトされた際、ログイン後に復帰する先のstateを保存する。
     */
    public setResumeState(): void {
        if (this.$state.transition) {
            this.resumeState = this.$state.transition.to();
            this.resumeStateParams = this.$state.transition.params();
        } else {
            this.clearResumeState();
        }
    }

    /**
     * ResumeのためのStateをクリアする
     */
    private clearResumeState(): void {
        this.resumeState = null;
        this.resumeStateParams = null;
    }

    /**
     * Resume Stateが保存されていた場合は遷移する。
     * 保存されていない場合はhomeへ遷移する。
     * @param homeState
     * @param params
     */
    public resume(homeState: string, params?: uiRouter.StateParams): void {
        if (this.resumeState) {
            this.$state.go(this.resumeState, this.resumeStateParams);
            this.clearResumeState();
        } else {
            this.$state.go(homeState, params);
        }
    }

    /**
     * ログイン済かどうか
     */
    protected get IsLoggedIn(): boolean {
        return this.authToken != null;
    }

    private readonly TOKEN_KEY = "auth_token";  // Tokenをstorageに保存する際のキー
    private _token: string;

    protected get authToken(): string {
        if (!this._token) {
            this._token = this.$window.sessionStorage.getItem(this.TOKEN_KEY);
        }
        // if (!this._token) {
        //     this._token = this.$window.localStorage.getItem(this.TOKEN_KEY);
        // }
        return this._token;
    }

    protected set authToken(value: string) {
        this._token = value;
        this.$window.sessionStorage.setItem(this.TOKEN_KEY, value);
        // this.$window.localStorage.setItem(this.TOKEN_KEY, value);
    }

    protected removeToken() {
        this._token = null;
        this.$window.sessionStorage.removeItem(this.TOKEN_KEY);
        this.$window.localStorage.removeItem(this.TOKEN_KEY);
    }

    protected SetBearerToken(): void {
        this.Restangular.setDefaultHeaders({ Authorization: "Bearer " + this.authToken });
    }

}
