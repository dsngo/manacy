/**
 * ディレクティブ定義の基底クラス
 */
export default class DirectiveBase {
    /**
     * 登録ディレクティブ名
     */
    public static readonly IID: string;

    /**
     * ディレクティブ定義オブジェクト(Directive Definition Object)を設定する。
     * @param ddo {ng.IDirective}
     */
    protected static setDDO(ddo: ng.IDirective): void {
        // no process.
    }

    /**
     * 受け継ぐディレクティブ定義オブジェクト(Directive Definition Object)を設定する。
     * @param ddo {ng.IDirective}
     */
    protected static setInheritDDO(ddo: ng.IDirective): void {
        // no process.
    }

    /**
     * ファクトリの依存注入定義
     */
    protected static $factoryInject: string[];

    /**
     * ファクトリ関数
     * @param ddo {ng.IDirective}
     * @param injections {*[]}
     */
    protected static $factory(ddo: ng.IDirective, ...injections: any[]): ng.IDirective {
        return ddo;
    }

    /**
     * ディレクティブを登録する。
     * @param app {ng.IModule}
     */
    public static register(app: ng.IModule): void {
        const ddo: ng.IDirective = {};
        this.setDDO(ddo);
        this.setInheritDDO(ddo);
        this.processDDO(ddo);

        app.directive(this.IID, this.generateFactory(ddo));
    }

    /**
     * DDOを加工する。
     * @param ddo {ng.IDirective}
     */
    private static processDDO(ddo: ng.IDirective): void {
        // ddoのlinkは関数として実行されてしまうため、static methodとして実行されるようにbindする。
        if (typeof ddo.link === "function") {
            ddo.link = (ddo.link as ng.IDirectiveLinkFn).bind(this);
        }
    }

    /**
     * ファクトリを生成する。
     * @param ddo {ng.IDirective}
     * @return {ng.IDirectiveFactory}
     */
    private static generateFactory(ddo: ng.IDirective): ng.IDirectiveFactory {
        const factory = this.$factory.bind(this, ddo);
        factory.$inject = this.$factoryInject;

        return factory;
    }
}
