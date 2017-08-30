import * as _ from "lodash";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import WsAssignmentService from "../../services/wsAssignmentService";
import WsElementSettings from "./wsElementSettings";

export default class WsElementSettingsBasic extends WsElementSettings {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementSettingsBasic";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/wsEditor/wsElementSettingsBasic.html";
    }

    public get textEnabled() {
        return "text" in this.settings;
    }
    public set textEnabled(value) {
        if (value) {
            this.settings.text = {};
        } else {
            delete this.settings.text;
        }
    }

    public get freeHandEnabled() {
        return "freeHand" in this.settings;
    }
    public set freeHandEnabled(value) {
        if (value) {
            this.settings.freeHand = {};
        } else {
            delete this.settings.freeHand;
        }
    }

    public get imageEnabled() {
        return "image" in this.settings;
    }
    public set imageEnabled(value) {
        if (value) {
            this.settings.image = {};
        } else {
            delete this.settings.image;
        }
    }

    public get videoEnabled() {
        return "video" in this.settings;
    }
    public set videoEnabled(value) {
        if (value) {
            this.settings.video = {};
        } else {
            delete this.settings.video;
        }
    }

    public get audioEnabled() {
        return "audio" in this.settings;
    }
    public set audioEnabled(value) {
        if (value) {
            this.settings.audio = {};
        } else {
            delete this.settings.audio;
        }
    }

    public get fileEnabled() {
        return "file" in this.settings;
    }
    public set fileEnabled(value) {
        if (value) {
            this.settings.file = {};
        } else {
            delete this.settings.file;
        }
    }

}
