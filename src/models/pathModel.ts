import Models from "./models";
import { PointModel } from "./pointModel";
export class PathModel {
    constructor(
        public pathId: number = 0,
        public points: string = "",
        public strokeWidth: string = "",
        public stroke: string = "",
        public fill: string = "none",
        public fontSize: number = 20,
        public isText: boolean = false,
        public textPoint: PointModel = new PointModel(),
        public textValue: string[] = [],
        public textBold: string = "none",
        public svgElementDto: Models.Dtos.SvgElementDto = null,
    ) {}

    public getSVGElement(): string {
        const textElmObj = {
            textId: this.pathId,
            color: this.stroke,
            bold: this.textBold !== "none",
            textValues: this.textValue.map((e, i) => ({ value: e, x: this.textPoint.x, y: this.textPoint.y + i * this.fontSize })),
        };

        const brushElmObj = {
            brushId: this.pathId,
            position: this.points,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
        };

        return JSON.stringify(this.isText ? textElmObj : brushElmObj);
    }
}
