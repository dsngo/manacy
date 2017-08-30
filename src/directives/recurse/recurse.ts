import * as _ from "lodash";
import DirectiveBase from "../directiveBase";

/**
 * 再帰ディレクティブの属性
 */
interface IRecurseAttributes extends ng.IAttributes {
    recurse: string;
    recurseVar: string;
}

/**
 * 再帰ディレクティブ
 */
export default class Recurse extends DirectiveBase implements ng.IController {
    /**
     * 登録ディレクティブ名
     */
    public static readonly IID: string = "recurse";

    /**
     * ディレクティブ定義オブジェクトを設定する。
     * @param ddo {ng.IDirective}
     */
    protected static setDDO(ddo: ng.IDirective): void {
        super.setDDO(ddo);

        _.extend(ddo, {
            transclude: true,
            restrict: "A",
            template: `<ng-transclude></ng-transclude>`,
            controller: Recurse,
            link: this.link,
        });
    }

    private static $parse: ng.IParseService;

    protected static $factoryInject: string[] = ["$parse"];

    protected static $factory(ddo: ng.IDirective, $parse: ng.IParseService) {
        this.$parse = $parse;
        return ddo;
    }

    /**
     * リンクする。
     * @param scope {ng.IScope}
     * @param element {ng.IAugmentedJQuery}
     * @param attrs {IRecurseAttributes}
     */
    protected static link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IRecurseAttributes): void {
        if (!attrs.recurse) {
            // tslint:disable-next-line:no-console
            console.error("Cannot specific Cannot specific recurse.");
            return;
        }

        if (attrs.recurseVar) {
            scope.$watch(attrs.recurse, (v) => this.$parse(attrs.recurseVar).assign(scope, v));
        }
    }

    /**
     * 再帰するデータ名
     */
    public name: string;

    public static $inject: string[] = ["$attrs", "$transclude"];

    /**
     * コンストラクタ
     * @param $attrs {IRecurseAttributes}
     * @param $transclude {ng.ITranscludeFunction}
     */
    constructor(private $attrs: IRecurseAttributes, public $transclude: ng.ITranscludeFunction) {
        super();
    }

    public $onInit() {
        this.name = this.$attrs.recurseVar || this.$attrs.recurse;
    }
}
