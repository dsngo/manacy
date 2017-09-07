import { BaseDrawModel, IBaseDrawModel } from "./BaseDrawModel";

export interface IBrushModel extends IBaseDrawModel {
    brushId: number;
    // fill: string;
    // stroke: number;
    strokeWidth: number;
}

export class BrushModel extends BaseDrawModel {
    constructor(baseSettings, public brushSettings: IBrushModel) {
        super(baseSettings);
    }
    public constructBrushElement(): string {
        const brushSVGElement: IBrushModel = { ...this.brushSettings, ...this.baseSettings };
        return JSON.stringify(brushSVGElement);
    }
}
