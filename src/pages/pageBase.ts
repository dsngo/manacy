import * as uiRouter from "angular-ui-router";
import ComponentBase from "../components/componentBase";

export default class PageComponent extends ComponentBase {

    /**
     * StateのResolveに指定された変数をbindingsに追加する
     * @param bindings
     * @param state
     */
    protected static setResolveBindings(options: ng.IComponentOptions, state: uiRouter.Ng1StateDeclaration): void {
        state.resolve = state.resolve || {};
        options.bindings = options.bindings || {};

        // resolveに含まれるkeyをすべてbindingsに追加。resolveされた変数・サービスがbindingできる
        for (const key in state.resolve) {
            options.bindings[key] = "<";
        }
    }

    /**
     * ui-uiRouterのstateを設定する
     */
    public static readonly state: uiRouter.Ng1StateDeclaration;

    /**
     * ui-uiRouterにstateを登録する
     */
    public static register(app: ng.IModule): void {
        // コンポーネントを登録
        super.register(app);

        // stateを取得
        const state = this.state;
        state.component = this.IID;
        state.name = this.IID;

        // ui-uiRouterのstateを登録
        app.config(["$stateProvider", ($stateProvider: uiRouter.StateProvider) => {
            // uiRouter Setting
            $stateProvider.state(state);
        }]);
    }

    /**
     * InjectするService
     */
    public static $inject = ["$scope"];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public $scope: ng.IScope,
    ) {
        super();
    }

}
