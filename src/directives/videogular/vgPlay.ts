import * as _ from "lodash";
import DirectiveBase from "../directiveBase";

export default class VgPlay extends DirectiveBase {
    /**
     * 登録ディレクティブ名
     */
    public static readonly IID: string = "vgPlay";

    /**
     * ディレクティブ定義オブジェクトを設定する。
     * @param ddo {ng.IDirective}
     */
    protected static setDDO(ddo: ng.IDirective): void {
        _.extend(ddo, {
            restrict: "A",
            require: "videogular",
            link: this.link,
        });
    }

    private static $parse: ng.IParseService;

    protected static $factoryInject: string[] = ["$parse"];

    protected static $factory(ddo: ng.IDirective, $parse: ng.IParseService) {
        this.$parse = $parse;
        return ddo;
    }

    private static link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, videogular: ng.vg.IVgController) {
        const onPlay = videogular.onPlay;
        videogular.onPlay = () => {
            this.$parse(attrs.vgPlay)(scope);
            onPlay.bind(videogular);
        };
    }
}
