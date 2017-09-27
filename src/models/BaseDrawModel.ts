import { Subject } from "rxjs/Subject";

export interface IBaseDrawModel {
    currentTool: string;
    color: string;
}

export class BaseDrawModel {
    constructor(public baseSettings: IBaseDrawModel = { currentTool: "line", color: "#000000" }) {}

    private pathsSubject: Subject<string> = new Subject<string>();

    public getCurrentToolSubject(): Subject<string> {
        return this.pathsSubject;
    }
    public setCurrentTool(value: string) {
        this.baseSettings.currentTool = value;
        this.pathsSubject.next(value);
    }
}
