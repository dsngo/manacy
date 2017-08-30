import * as _ from "lodash";
import DirectiveBase from "../directiveBase";
import Recurse from "./recurse";

/**
 * 再帰ディレクティブノードの属性
 */
interface IRecurseNodeAttributes extends ng.IAttributes {
    recurseNode: string;
}

/**
 * 再帰ディレクティブの要素
 */
export default class RecurseNode extends DirectiveBase {
    /**
     * 登録ディレクティブ名
     */
    public static readonly IID: string = "recurseNode";

    /**
     * ディレクティブ定義オブジェクトを設定する。
     * @param ddo {ng.IDirective}
     */
    protected static setDDO(ddo: ng.IDirective): void {
        super.setDDO(ddo);

        _.extend(ddo, {
            restrict: "A",
            require: "^recurse",
            link: this.link,
        });
    }

    protected static $parse: ng.IParseService;

    protected static $factoryInject: string[] = ["$parse"];

    protected static $factory(ddo: ng.IDirective, $parse: ng.IParseService) {
        this.$parse = $parse;
        return ddo;
    }

    protected static link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IRecurseNodeAttributes, recurse: Recurse): void {
        if (!attrs.recurseNode) {
            // tslint:disable-next-line:no-console
            console.error("Cannot specific Cannot specific recurseNode.");
            return;
        }

        scope.$watch(attrs.recurseNode, (v) => this.$parse(recurse.name).assign(scope, v));
        recurse.$transclude(scope, (e) => element.append(e));
    }
}
