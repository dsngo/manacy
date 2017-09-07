import { BaseDrawModel, IBaseDrawModel } from "./BaseDrawModel";

export interface ITextModel extends IBaseDrawModel {
    textId: number;
    fontSize: number;
    textValue: string[];
    isBold: boolean;
}

export class TextModel extends BaseDrawModel {
    constructor(baseSettings, public textSettings: ITextModel) {
        super(baseSettings);
    }
    public constructTextElement(): string {
        const textSVGElement: ITextModel = { ...this.textSettings, ...this.baseSettings };
        return JSON.stringify(textSVGElement);
    }
}
