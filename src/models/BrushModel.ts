export interface IBrushProps {
    fill: string;
    stroke: string;
    strokeWidth: string;
    points: string;
}

export class BrushModel {
    constructor(
        public brushProps: IBrushProps = { fill: "#000", stroke: "#000", strokeWidth: "1px", points: "" },
    ) {}
}
