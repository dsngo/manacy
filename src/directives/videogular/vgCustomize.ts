import * as _ from "lodash";
import DirectiveBase from "../directiveBase";

declare module "angular" {
    export namespace vg {
        interface IVgController {
            reset(): void;
        }
    }
}

export default class VgCustomize extends DirectiveBase {
    /**
     * 登録ディレクティブ名
     */
    public static readonly IID: string = "vgCustomize";

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

    private static $timeout: ng.ITimeoutService;

    protected static $factoryInject: string[] = ["$timeout"];

    protected static $factory(ddo: ng.IDirective, $timeout: ng.ITimeoutService) {
        this.$timeout = $timeout;
        return ddo;
    }

    protected static link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, videogular: angular.vg.IVgController) {
        videogular.reset = () => {
            videogular.stop();

            const video = videogular.mediaElement[0] as HTMLVideoElement;
            if (!video.src) {
                return;
            }

            const repairingSrc = video.src;
            video.src = null;
            video.removeAttribute("src");
            this.$timeout(() => {
                video.src = repairingSrc;
                videogular.totalTime = 0;
                videogular.onVideoReady();
            });
        };
    }
}
