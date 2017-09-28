import { Subject } from "rxjs/Subject";

export interface IBaseDrawModel {
    currentTool: string;
}

export class BaseDrawModel {
    private toolsSubject: Subject<string> = new Subject<string>();
    constructor(public baseSettings: IBaseDrawModel = { currentTool: "line" }) {}
    public getCurrentToolSubject(): Subject<string> {
        return this.toolsSubject;
    }
    public setCurrentTool(tool: string): void {
        this.baseSettings.currentTool = tool;
        this.toolsSubject.next(tool);
    }
}
