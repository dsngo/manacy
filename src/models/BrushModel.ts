import { BaseDrawModel, IBaseDrawModel } from "./BaseDrawModel";

export interface IBrushModel extends IBaseDrawModel {
    brushId: number;
    fill: string;
    stroke: string;
    strokeWidth: string;
    points: string;
}

export class BrushModel extends BaseDrawModel {
    constructor(public brushSettings: IBrushModel) {
        super();
    }
    public constructElement(): string {
        const brushSVGElement: IBrushModel = { ...this.baseSettings, ...this.brushSettings };
        return JSON.stringify(brushSVGElement);
    }
}
