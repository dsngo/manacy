import { Subject } from "rxjs/Subject";

export interface IBaseDrawModel {
    currentTool: string;
    color: string;
    positionX: number;
    positionY: number;
}

export class BaseDrawModel {
    constructor(public baseSettings: IBaseDrawModel = { currentTool: "line", color: "#000000", positionX: 1, positionY: 1 }) {}

    private pathsSubject: Subject<string> = new Subject<string>();

    public getCurrentToolSubject(): Subject<string> {
        return this.pathsSubject;
    }
    public setCurrentTool(value: string) {
        this.baseSettings.currentTool = value;
        this.pathsSubject.next(value);
    }
}
