/**
 * コンポーネント定義の基底クラス
 * @returns
 */
export default class ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string;

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions): void { };

    protected static setInheritOptions(options: ng.IComponentOptions): void {
        options.bindings = options.bindings || {};
    }

    /**
     * componentを登録する
     */
    public static register(app: ng.IModule): void {
        const options: ng.IComponentOptions = {};
        this.setOptions(options);
        this.setInheritOptions(options);

        options.controller = this;
        app.component(this.IID, options);
    }

}
