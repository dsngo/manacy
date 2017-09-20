import { BaseDrawModel, IBaseDrawModel } from "./BaseDrawModel";

export interface ITextModel extends IBaseDrawModel {
    textId: number;
    fontSize: number;
    textValue: string[];
    isBold: boolean;
}

export class TextModel extends BaseDrawModel {
    constructor(public textSettings: ITextModel) {
        super();
    }
    public constructElement(): string {
        const textSVGElement: ITextModel = { ...this.baseSettings, ...this.textSettings };
        return JSON.stringify(textSVGElement);
    }
}
