import * as angular from "angular";
import { BrushModel, IBrushProps } from "../../models/BrushModel";
import { PointModel } from "../../models/pointModel";
// import { DrawModel } from "../../models/drawModel";
import { ITextProps, TextModel } from "../../models/TextModel";
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
    private textBoxSetLeft = 20;
    private textBoxSetTop = 300;
    private isTextBoxDraggable: boolean = false;
    private textRows: number = 1;
    private textCol: number = 20;

    protected controlType: string = "bezier";
    protected omitValue: number = 4;
    protected textBoxHideClass = "";
    protected isTextDrawing: boolean = false;
    protected isTextEditing: boolean = false;
    protected drawingBranch: PathModel[] = [];
    protected currentPath: PathModel = null;
    protected textValue: string = "";
    protected pulledDate: string = "";

    public mouseDown(event): void {
        // Event handler for Left-click
        if (
            event.buttons !== 2 &&
            event.target.nodeName === "tspan" &&
            this.drawModel.currentTool !== "line" &&
            this.textValue === ""
        ) {
            const textId = event.target.getAttribute("text-id") * 1;
            this.editText(textId);
            return;
        }
        this.startDraw(event.x, event.y);
    }

    public mouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const pointX = event.x - rect.left;
        const pointY = event.y - rect.top;
        this.drawing(pointX, pointY);
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
            this.drawService.drawText(
                this.calculatePoint(),
                this.drawModel,
                this.textValue,
                this.isTextEditing && this.pulledDate,
            );
            this.isTextDrawing = false;
            this.textRows = 1;
            this.textCol = 20;
            this.isTextEditing = false;
            return (this.textValue = "");
        }
        this.textCol = 20;
        this.textValue = "";
        this.textBoxSetLeft = x;
        this.textBoxSetTop = y;
        this.isTextDrawing = true;
    }

    private async editText(textId): Promise<void> {
        const obj = await this.drawService.findEditableText(textId);
        this.textValue = obj.text;
        this.textBoxSetLeft = obj.x;
        this.textBoxSetTop = obj.y - (this.drawModel.fontSize + 10);
        this.isTextEditing = true;
        this.isTextDrawing = true;
        this.textRows = obj.text.split("\n").length;
        this.textCol = this.colLength(obj.text.split("\n"));
        this.pulledDate = obj.createdDate;
        this.drawModel.color = obj.color;
        this.drawModel.isTextBold = obj.bold;
        this.drawModel.fontSize = obj.fontSize;
        this.drawService.cleanText(obj.index);
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

    public keyPressOntextArea(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.textRows += 1;
        } else {
            this.textCol = this.colLength(this.textValue.split("\n"));
        }
    }

    private colLength(array: string[]): number {
        const length = array.sort((a, b) => b.length - a.length)[0].length;
        console.log(length); // tslint:disable-line
        return length > 20 ? (length + 1) : 20;
    }
}
