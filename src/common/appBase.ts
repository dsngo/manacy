// Import our Angular dependencies

import * as angular from "angular";
/*
import 'angular-animate';
// import 'angular-aria';
import 'angular-messages';
import 'angular-material';
import 'angular-sanitize';
import 'restangular';
import 'v-accordion';
import 'angular-ui-router';
*/

import "./../models/global";

import registerErrSrc from "./errSrc";
import registerQuill from "./quill";
import registerToArray from "./toArray";

// tslint:disable-next-line:no-namespace
declare global {
    /**
     * APIのURL（index.htmlで定義）
     */
    const API_PATH: string;
    /**
     * Avatar ImageのURL（index.htmlで定義）
     */
    const AVATAR_PATH: string;

    /**
     * 教師/生徒判定用（暫定、index.htmlで定義）
     * 0:教師 1:生徒
     */
    const APP_TYPE: number;
}

/**
 * API URL
 */
export default class AppBase {
    /**
     * APIのURL
     */
    // public static readonly API_PATH = "http://localhost:11078/api";

    /**
     * メインモジュール
     */
    protected static appModule: ng.IModule;

    protected static getAppModuleName(): string {
        return;
    }

    /**
     * メインモジュール生成・取得
     */
    public static getModule(): ng.IModule {
        this.appModule =
            this.appModule ||
            angular.module(this.getAppModuleName(), [
                "mdColorPicker",
                "ngMaterial",
                "ngMdIcons",
                "ui.router",
                "ngSanitize",
                "restangular",
                "vAccordion",
                "ngAnimate",
                "ngQuill",
                "ngFileUpload",
                "angular-carousel",
                "com.2fdevs.videogular",
                "com.2fdevs.videogular.plugins.controls",
                "com.2fdevs.videogular.plugins.poster",
                "ngMessages",
                "dndLists",
            ]);

        return this.appModule;
    }

    // 注意：static getterの中のthisは、呼び出し元のクラスを指さない。
    // https://github.com/Microsoft/TypeScript/issues/4327
    // static functionならばthisは呼び出し元を指す
    //
    // public static get module(): ng.IModule {
    //     return this.getModule();
    // }

    /**
     * アプリケーション初期化
     * （本メソッド呼び出しより先にgetModuleを最低1回は呼んでおくこと）
     */
    protected static Init() {
        // API URLの設定
        this.getModule().config([
            "RestangularProvider",
            (RestangularProvider: Restangular.IProvider) => {
                RestangularProvider.setBaseUrl(API_PATH);
            },
        ]);

        // AngularJS Materialのテーマの設定

        this.getModule().config([
            "$mdThemingProvider",
            $mdThemingProvider => {
                $mdThemingProvider.theme("DrawUITheme");
            },
        ]);

        this.getModule().config([
            "$mdThemingProvider",
            (IThemingProvider: ng.material.IThemingProvider) => {
                IThemingProvider.theme("default")
                    .primaryPalette("light-green", { default: "700" })
                    .accentPalette("purple");
                IThemingProvider.theme("blue")
                    .primaryPalette("blue", { default: "800" })
                    .accentPalette("deep-orange");
                IThemingProvider.theme("red")
                    .primaryPalette("red", { default: "700" })
                    .accentPalette("blue");
                IThemingProvider.theme("yellow")
                    .primaryPalette("yellow")
                    .accentPalette("indigo");
                IThemingProvider.alwaysWatchTheme(true);
            },
        ]);

        registerQuill(this.getModule());
        registerErrSrc(this.getModule());
        registerToArray(this.getModule());
    }
}
