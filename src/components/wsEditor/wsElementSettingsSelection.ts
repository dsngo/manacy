import * as _ from "lodash";
import Models from "../../models/models";
import WsEditorService from "../../services/wsEditorService";
import WsAssignmentService from "../../services/wsAssignmentService";
import WsElementSettings from "./wsElementSettings";

export default class WsElementSettingsSelection extends WsElementSettings {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsElementSettingsSelection";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/wsEditor/wsElementSettingsSelection.html";
    }

    public addLabel: string;
    public addText: string;

    public get items() {
        return this.settings.selection ? this.settings.selection.items : [];
    }

    public get enableMulti(): boolean {
        if (this.settings.selection) {
            return this.settings.selection.maxSelections > 1 || this.settings.selection.minSelections === 0;
        }
        return false;
    }

    public set enableMulti(value) {
        if (value) {
            if (!this.settings.selection) {
                this.settings.selection = {
                    items: [],
                    maxSelections: 1,
                    minSelections: 0,
                    isShowRight: false,
                    isShowBorder: false,
                };
                return;
            }
            this.settings.selection.maxSelections = this.settings.selection.items.length;
            if (this.settings.selection.maxSelections < 2) {
                this.settings.selection.minSelections = 0;
            }
        } else {
            if (this.settings.selection) {
                this.settings.selection.maxSelections = 1;
                this.settings.selection.minSelections = 1;
            }
        }
    }

    public addItem() {
        if (!this.settings.selection) {
            this.settings.selection = {
                items: [],
                maxSelections: 1,
                minSelections: 1,
                isShowRight: false,
                isShowBorder: false,
            };
        }
        this.settings.selection.items.push({
            label: this.addLabel,
            text: this.addText,
        });
        this.addLabel = "";
        this.addText = "";
    }
}
