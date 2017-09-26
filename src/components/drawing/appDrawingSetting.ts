import * as angular from "angular";
import * as _ from "lodash";
import { DrawModel } from "../../Models/drawModel";
import DrawService from "../../Services/drawService";
import ComponentBase from "../componentBase";

export default class AppDrawingSetting extends ComponentBase {
    public static readonly IID: string = "settingComponent";
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.controllerAs = "settingCtrl";
        options.bindings = { drawModel: "=" };
        if (
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            // navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        ) {
            options.templateUrl = "../components/drawing/appDrawingSettingMobile.html";
        } else {
            options.templateUrl = "../components/drawing/appDrawingSetting.html";
        }
    }

    protected showBrushToolClass: string = "";
    protected showTextToolClass: string = "";
    protected showColorToolClass: string = "";

    protected activeBrushToolClass: string = "active";
    protected activeTextToolClass: string = "";
    protected brushToolHideClass: string = "";
    protected textToolHideClass: string = "";
    protected colorToolHideClass: string = "";

    private mobileBottom: string = "";
    private mobileRotate: string = "mobile-rotate";

    public static $inject = ["drawService", "$window", "$mdDialog"];

    private drawModel: DrawModel;

    private strokeItems: any[] = [1, 5, 10, 20, 50, 100, 200];

    public cancel(): void {
        const thisComponent = this;

        // parentElementパラメーターをダイアログに渡す
        // const dialogOption = WsDrawingDialog.getDialogOptions($event);

        this.$mdDialog.cancel();
    }

    private scrollStrokeValue(): void {
        const staticStrokeItems: any[] = [1, 1, 5, 10, 20, 50, 100, 200];
        this.strokeItems = staticStrokeItems;
        this.strokeItems = _.remove(this.strokeItems, el => {
            return el !== Number(this.drawModel.stroke);
        });
        this.strokeItems[0] = this.drawModel.stroke;

        // this.hideBrushTool();
    }

    private selectStrokeChange() {
        const staticStrokeItems: any[] = [1, 1, 5, 10, 20, 50, 100, 200];
        this.strokeItems = staticStrokeItems;
        this.strokeItems = _.orderBy(this.strokeItems, "asc");
        this.strokeItems = _.remove(this.strokeItems, el => {
            return el !== Number(this.drawModel.stroke);
        });
        this.strokeItems[0] = this.drawModel.stroke;

        // this.hideBrushTool();
    }

    private colorItems: string[] = [
        "#000000",
        "#FFFFFF",
        "#E60012",
        "#F39800",
        "#FFF100",
        "#8FC31F",
        "#009944",
        "#009E96",
        "#00A0E9",
        "#0068B7",
        "#1D2088",
        "#920783",
    ];

    private fontSizeItems: number[] = [10, 20, 30, 40, 50, 60, 70, 80];

    private toolSetTop: number = 60;
    private toolSetRight: number = 0;
    private brushToolTop: number = 60;
    private brushTooltRight: number = 0;
    private textToolTop: number = 60;
    private textTooltRight: number = 0;
    private colorToolTop: number = 350;
    private colorToolRight: number = 0;
    private check = true;
    public constructor(
        public drawService: DrawService,
        public window: ng.IWindowService,
        public $mdDialog: ng.material.IDialogService,
    ) {
        super();
        this.toolSetRight = window.innerWidth - 20;
        this.brushTooltRight = window.innerWidth - 80;
        this.textTooltRight = window.innerWidth - 80;
        this.colorToolRight = window.innerWidth - 80;
    }

    protected upFontSize() {
        this.drawModel.fontSize = this.drawModel.fontSize + 1;
    }
    protected downFontSize() {
        this.drawModel.fontSize = this.drawModel.fontSize - 1;
    }

    private selectFontChange() {
        const staticfontSizeItems: number[] = [10, 20, 30, 40, 50, 60, 70, 80];

        this.fontSizeItems = staticfontSizeItems;
        this.fontSizeItems = _.orderBy(this.fontSizeItems, "asc");
        this.fontSizeItems = _.remove(this.fontSizeItems, el => {
            return el !== Number(this.drawModel.fontSize);
        });
        this.fontSizeItems[0] = this.drawModel.fontSize;

        this.hideTextTool();
    }

    protected setStroke(value: number): void {
        this.drawModel.stroke = value;
        // this.hideBrushTool();
    }

    protected setColor(value) {
        this.drawModel.color = value;
        this.showColorToolClass = "";
    }

    protected toggleColorTool() {
        this.showColorToolClass = this.showColorToolClass === "" ? "show" : "";
    }

    protected undo() {
        this.drawService.undoPath();
    }

    protected redo() {
        this.drawService.redoPath();
    }

    protected clear() {
        this.drawService.clearDrawingPaths();
    }
    protected showTool(tool): void {
        // this.showBrushToolClass = "";
        // this.showTextToolClass = "";
        this.activeBrushToolClass = "";
        this.activeTextToolClass = "";
        switch (tool) {
            case 1:
                // Show/hide tool panel when click button
                this.showBrushToolClass = this.showBrushToolClass === "show" ? "" : "show";
                this.showTextToolClass = "";
                this.activeBrushToolClass = "active";
                this.drawModel.setCurrentTool("line");
                break;
            case 2:
                // Show/hide tool panel when click button
                this.showTextToolClass = this.showTextToolClass === "show" ? "" : "show";
                this.showBrushToolClass = "";
                this.activeTextToolClass = "active";
                this.drawModel.setCurrentTool("text");
                break;
            default:
                break;
        }
    }

    protected minimizeBrushTool() {
        if (this.brushToolHideClass === "") {
            this.brushToolHideClass = "hide";
        } else {
            this.brushToolHideClass = "";
        }
    }

    protected minimizeTextTool() {
        if (this.textToolHideClass === "") {
            this.textToolHideClass = "hide";
        } else {
            this.textToolHideClass = "";
        }
    }

    protected hideBrushTool() {
        this.showBrushToolClass = "";
    }

    protected hideTextTool() {
        this.showTextToolClass = "";
    }

    protected minimizeColorTool() {
        if (this.colorToolHideClass === "") {
            this.colorToolHideClass = "hide";
        } else {
            this.colorToolHideClass = "";
        }
    }
    private isDraggable: boolean = false;

    public activeBold() {
        this.drawModel.isTextBold = !this.drawModel.isTextBold;
        // this.hideTextTool();
    }

    public mobileGoBottom() {
        this.mobileBottom = this.mobileBottom === "" ? "mobile-bottom" : "";
        this.mobileRotate = this.mobileRotate === "" ? "mobile-rotate" : "";
    }
}
