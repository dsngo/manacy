import * as angular from "angular";

declare module "angular" {
    export namespace vg {
        interface IVgController {
            currentTime: number;
            totalTime: number;
            isFullScreen: boolean;
            mediaElement: ng.IAugmentedJQuery;

            stop(): Error;
            onVideoReady(): void;
            onPlay(): void;
        }

        interface IMediaSource {
            src: string;
            type: string;
        }
    }
}
