export interface ITextProps {
    fontSize: number;
    color: string;
    textValue: string[];
    isBold: boolean;
    pX: number;
    pY: number;
}

export class TextModel {
    constructor(
        public textProps: ITextProps = {
            fontSize: 20,
            color: "#000",
            textValue: [""],
            isBold: false,
            pX: 1,
            pY: 1,
        },
    ) {}
}
