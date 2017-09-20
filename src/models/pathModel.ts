import Models from "./models";
import { PointModel } from "./pointModel";
import { TextModel, ITextModel } from "./TextModel";
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
        if (this.isText) {
            let text: object = {
                textId: this.pathId,
                x: this.textPoint.x,
                y: this.textPoint.y,
                fill: this.stroke,
                fontSize: this.fontSize,
                stroke: this.textBold,
                strokeWidth: 1,
                element: this.textValue
            }
            let iTextSetting:ITextModel;
            let baseSetting = {
            }
            // let textM: TextModel = new TextModel();
            // elm = `<text text-id="${this.pathId}" x="${this.textPoint.x}" y="${this.textPoint.y}" fill="${this.stroke}" font-size="${this
            //     .fontSize}" stroke="${this.textBold}" stroke-width="1px">`;
            // for (let index = 0; index < this.textValue.length; index++) {
            //     const element = this.textValue[index];
            //     elm += `<tspan x="${this.textPoint.x}" y="${this.textPoint.y + index * this.fontSize}" >${element}</tspan>`;
            // }
            // elm += "</text>";
            return JSON.stringify(text);
        } else {
            let path: object = {
                pathId: this.pathId,
                d: this.points,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth
            }
            // elm = `<path path-id="${this.pathId}" stroke-linecap="round" d="${this.points}" fill="none" stroke="${this.stroke}" stroke-width="${this
            //     .strokeWidth}"></path>`;
            return JSON.stringify(path);
        }
        // return elm;
    }
    public static parseString(data: Models.Dtos.SvgElementDto): PathModel {
        const parser = new DOMParser();
        const doc = JSON.parse(data.element)
        // const doc = parser.parseFromString(data.element, "text/xml");
        const path = new PathModel();
        path.svgElementDto = data;
        // if (doc.documentElement.localName === "path") {
        //     path.isText = false;
        //     path.pathId = doc.documentElement.attributes["path-id"].value * 1;
        //     path.points = doc.documentElement.attributes["d"].value;
        //     path.stroke = doc.documentElement.attributes["stroke"].value;
        //     path.strokeWidth = doc.documentElement.attributes["stroke-width"].value;
        // } else {
        //     path.isText = true;
        //     path.pathId = doc.documentElement.attributes["text-id"].value * 1;
        //     path.stroke = doc.documentElement.attributes["fill"].value;
        //     path.fontSize = doc.documentElement.attributes["font-size"].value * 1;
        //     path.textBold = doc.documentElement.attributes["stroke"].value;
        //     path.textPoint.x = doc.documentElement.attributes["x"].value * 1;
        //     path.textPoint.y = doc.documentElement.attributes["y"].value * 1;
        //     for (let index = 0; index < doc.documentElement.childElementCount; index++) {
        //         const element = doc.documentElement.children[index];
        //         path.textValue.push(element.textContent);
        //     }
        // }
        if (doc.pathId) {
            path.isText = false;
            path.pathId = doc.pathId * 1;
            path.points = doc.d;
            path.stroke = doc.stroke;
            path.strokeWidth = doc.strokeWidth;
        }
        else {
            path.textValue = doc.textValue;
            path.isText = true;
            path.pathId = doc.textId * 1;
            path.stroke = doc.color;
            path.fontSize = doc.fontSize * 1;
            path.textBold = doc.isBold;
            path.textPoint.x = doc.positionX;
            path.textPoint.y = doc.positionY;
        }
        return path;
    }
}
