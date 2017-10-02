export interface ITextProps {
    fontSize: number;
    color: string;
    textValue: string[];
    isBold: boolean;
    pX: number;
    pY: number;
}

export interface IBrushProps {
    fill: string;
    stroke: string;
    strokeWidth: string;
    points: string;
    controlType: string;
}

export interface IEditableTextProps extends ITextProps {
    index: number;
    createDate: string;
}
