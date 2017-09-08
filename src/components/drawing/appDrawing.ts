import * as angular from "angular";
import { DrawModel } from "../../models/drawModel";
import { PathModel } from "../../models/pathModel";
import { PointModel } from "../../models/pointModel";
import DrawService from "../../services/drawService";
import ComponentBase from "../componentBase";

export default class AppDrawing extends ComponentBase {
    public static readonly IID: string = "drawComponent";

    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.controllerAs = "drawCtrl";
        options.bindings = { drawModel: "=" };
        options.templateUrl = "../components/drawing/appDrawing.html";
    }

    public static $inject = ["drawService", "$window"];

    public constructor(public drawService: DrawService, public window: ng.IWindowService) {
        super();

        // Get init paths
        this.drawingBranch = this.drawService.getPaths();

        this.drawService.getPathsSubject().subscribe((newPaths: PathModel[]) => {
            this.drawingBranch = newPaths;
        });
        this.drawService.getCurrentPathSubject().subscribe((newPath: PathModel) => {
            this.currentPath = newPath;
        });
        this.drawModel.getCurrentToolSubject().subscribe((newValue: string) => {
            if (newValue === "line") {
                if (this.isTextDrawing && this.textValue !== "") {
                    this.drawService.drawText(this.calculatePoint(), this.drawModel, this.textValue);
                }
                this.isTextDrawing = false;
            }
        });
    }
    private drawModel: DrawModel;
    private isDrawing = false;
    private textBoxSetLeft = 300;
    private textBoxSetTop = 300;
    private isTextBoxDraggable: boolean = false;

    protected controlType: string = "bezier";
    protected omitValue: number = 4;
    protected textBoxHideClass = "";
    protected isTextDrawing: boolean = false;
    protected isTextEditing: boolean = false;
    protected drawingBranch: PathModel[] = [];
    protected currentPath: PathModel = null;
    protected textValue: string = "";

    public mouseDown(event) {
        // Event handler for Left-click
        if (event.buttons !== 2) {
            if (event.target.nodeName === "tspan" && this.drawModel.currentTool !== "line") {
                const textId = event.target.getAttribute("text-id") * 1;
                this.editText(textId);
            }
            this.startDraw(event.x, event.y);
        }
    }

    public mouseMove(event) {
        
        const rect = event.currentTarget.getBoundingClientRect();
        const pointX = event.x - rect.left;
        const pointY = event.y - rect.top;
        this.drawing(pointX, pointY);
    }

    private async editText(textId) {
        const obj = await this.drawService.findEditableText(textId);
        this.startEditText(obj.x, obj.y - 30, obj.text);
        this.drawService.cleanText(obj.index);
    }

    public startDraw(x, y) {
        if (this.drawModel.currentTool === "line") {
            this.startDrawLine();
            return;
        }
        this.startDrawText(x, y);
    }

    private startDrawLine() {
        this.isDrawing = true;
        this.drawService.startDraw();
    }

    private startDrawText(x, y) {
        if (this.isTextDrawing && this.textValue !== "") {
            this.drawService.drawText(this.calculatePoint(), this.drawModel, this.textValue);
            this.isTextDrawing = false;
            this.textRows = 1;
            this.textCol = 20;
            return;
        }
        this.textValue = "";
        this.textBoxSetLeft = x;
        this.textBoxSetTop = y;
        this.isTextDrawing = true;
    }

    private startEditText(x, y, text: string) {
        this.textValue = text;
        this.textBoxSetLeft = x;
        this.textBoxSetTop = y;
        this.isTextDrawing = true;
        if (this.isTextDrawing && this.textValue !== text) {
            this.drawService.drawText({x, y}, this.drawModel, this.textValue);
            this.isTextDrawing = false;
            this.textRows = 1;
            this.textCol = 20;
            this.isTextEditing = false;
            return;
        }
    }

    protected calculatePoint(): PointModel {
        return new PointModel(this.textBoxSetLeft, this.textBoxSetTop + this.drawModel.fontSize + 10);
    }

    public drawing(x, y) {
        if (this.isDrawing) {
            this.drawService.drawing(x, y, this.controlType, this.drawModel);
        }
    }

    public stopDraw() {
        if (!this.isDrawing) {
            return;
        }
        this.isDrawing = false;
        this.drawService.stopDraw(this.omitValue, this.controlType);
    }

    public clear() {
        this.drawService.clearDrawingPaths();
    }

    protected getFontSize(): string {
        return this.drawModel.fontSize + "px";
    }

    public touchstart(event: TouchEvent) {
        this.startDraw(event.touches[0].pageX, event.touches[0].pageY);
    }
    public touchMove(event: TouchEvent) {
        this.drawing(event.touches[0].pageX, event.touches[0].pageY);
    }
    // public touchEnd(event) {}
    private textRows: number = 1;
    private textCol: number = 20;

    public keyPressOntextArea(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.textRows += 1;
        } else {
            this.textCol = this.maxLength(this.textValue.split("\n"));
        }
    }

    private maxLength(array: string[]): number {
        let maxL = 20;
        array.forEach(el => {
            if (el.length > maxL) {
                maxL = el.length;
            }
        });
        return maxL;
    }
}
