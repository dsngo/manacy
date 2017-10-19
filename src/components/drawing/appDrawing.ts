import * as angular from "angular";
import { IBrushProps, IEditableTextProps, ITextProps } from "../../models/DrawingTypes";
import { PointModel } from "../../models/pointModel";
import WsSVGElementModel from "../../models/WsSVGElementModel";
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
        this.drawService.getPathSubjects().subscribe((newPaths: WsSVGElementModel[]) => (this.drawingBranch = newPaths));
        this.drawService
            .getCurrentToolSubject()
            .subscribe(
                (drawingTool: string) =>
                    drawingTool === "line" &&
                    (this.isTextDrawing && this.getTextString() !== "" && this.drawService.drawText(this.textProps),
                    (this.isTextDrawing = false)),
            );
        this.drawService.getCurrentPathSubject().subscribe((newPath: WsSVGElementModel) => {
            const { element } = newPath;
            return element.fill ? (this.brushProps = element) : (this.textProps = element);
        });
    }
    private isBrushDrawing: boolean;
    private isTextDrawing: boolean;
    private isTextEditing: boolean;
    private drawingBranch: WsSVGElementModel[];
    private textProps: ITextProps;
    private textInitializer = { setLeft: 20, setTop: 300, rows: 1, cols: 20 };
    private brushProps: IBrushProps;
    private brushInitializer = { controlType: "bezier", omitValue: 4 };
    protected targetDate: string = "";

    public mouseDown(event): void {
        // Event handler for Left-click
        if (this.isTextDrawing && event.buttons !== 2 && event.target.nodeName === "tspan" && this.getTextString() === "") {
            const textId = event.target.id * 1;
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
        if (this.drawService.currentTool === "line") {
            this.startDrawLine();
            return;
        }
        this.startDrawText(x, y);
    }

    private startDrawLine() {
        this.isBrushDrawing = true;
        this.drawService.clearPreviousPoints();
    }

    private startDrawText(x, y) {
        if (this.isTextDrawing && this.getTextString() !== "") {
            this.drawService.drawText(this.textProps);
            this.isTextDrawing = false;
            this.textInitializer.rows = 1;
            this.textInitializer.cols = 20;
            this.isTextEditing = false;
            return (this.textProps.textValue = [""]);
        }
        this.textInitializer.setLeft = x;
        this.textInitializer.setTop = y;
        this.textInitializer.cols = 20;
        this.textProps.textValue = [""];
        this.isTextDrawing = true;
    }

    private async editText(textId: number): Promise<void> {
        const { index, createDate, textValue, pX, pY, color, fontSize, isBold } = await this.drawService.findTargetText(textId);
        this.isTextEditing = true;
        this.isTextDrawing = true;
        this.textProps = { ...this.textProps, fontSize, color, textValue, isBold };
        this.textInitializer = {
            rows: textValue.length,
            cols: this.colLength(textValue),
            setLeft: pX,
            setTop: pY - (fontSize + 10),
        };
        this.targetDate = createDate;
        this.drawService.cleanFrontEndElm(index);
    }

    public drawing(x, y) {
        if (this.isBrushDrawing) {
            this.drawService.drawBrush({ x, y }, this.brushInitializer.controlType, this.brushProps);
        }
    }

    public stopDraw() {
        if (!this.isBrushDrawing) {
            return;
        }
        this.isBrushDrawing = false;
        this.drawService.stopDrawingBrush(this.brushInitializer.omitValue, this.brushInitializer.controlType);
    }

    public clear() {
        this.drawService.cleanDrawingPaths();
    }
    // GETTERS
    //  === Get text properties ===
    protected getTextFontSize(): string {
        return `${this.textProps.fontSize}px`;
    }
    protected getTextColor(): string {
        return this.textProps.color || "#000";
    }
    protected getTextBGColor(): string {
        return this.isTextDrawing ? "#fff" : "none";
    }
    protected getTextString(): string {
        return this.textProps.textValue.join("\n");
    }
    protected getTextBold(): string {
        return this.textProps.isBold ? "textBoxBold" : "";
    }
    //  === Get brush properties ===
    protected getBrushPoints(): string {
        return this.brushProps.points;
    }

    protected getBrushFill() {
        return this.brushProps.fill || "none";
    }

    protected getBrushStroke(w: string): string {
        return !w ? this.brushProps.stroke || "#000" : this.brushProps.strokeWidth || "1px";
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
            this.textInitializer.rows += 1;
        } else {
            this.textInitializer.cols = this.colLength(this.textProps.textValue);
        }
    }

    private colLength(array: string[]): number {
        const length = array.sort((a, b) => b.length - a.length)[0].length;
        return length > 20 ? length : 20;
    }
}
