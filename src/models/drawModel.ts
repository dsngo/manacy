import { Subject } from "rxjs/Subject";
export class DrawModel {
    constructor(
        public stroke: number = 1,
        public color: string = "#000000",
        public currentTool: string = "line",
        public fontSize: number = 20,
        public isTextBold: boolean = false,
    ) {}

    private pathsSubject: Subject<string> = new Subject<string>();

    public getCurrentToolSubject(): Subject<string> {
        return this.pathsSubject;
    }
    public setCurrentTool(value: string) {
        this.currentTool = value;
        this.pathsSubject.next(value);
    }
}
