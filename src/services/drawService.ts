import * as restangular from "restangular";
import { Subject } from "rxjs/Subject";
import { IBrushProps, IEditableTextProps, ITextProps } from "../models/DrawingTypes";
import { DrawModel } from "../models/drawModel";
import { PointModel } from "../models/PointModel";
import WsSVGElementModel from "../models/WsSVGElementModel";
import WsSVGImageModel from "../models/WsSVGImageModel";
import { catmullRom2Bezier } from "./catmullRom2Bezier";
import { simplify } from "./drawSimplify";
import IdentityService from "./IdentityService";
import ServiceBase from "./serviceBase";

export default class DrawService extends ServiceBase {
    public static readonly IID = "drawService";
    public static $inject = ["Restangular", "$q", IdentityService.IID];
    public constructor(
        protected Restangular: restangular.IService,
        protected $q: ng.IQService,
        protected identityService: IdentityService,
    ) {
        super();
    }
    // Props
    public currentTool = "line";
    private toolSubject: Subject<string> = new Subject();
    private currentPath: WsSVGElementModel = new WsSVGElementModel(
        {
            fill: "none",
            stroke: "#000",
            strokeWidth: "1px",
            points: "",
            controlType: "bezier",
        },
        this.getUserId(),
        this.getUserId(),
    );
    private drawingPaths: WsSVGElementModel[];
    private drawingPoints: PointModel[];
    private pathSubjects: Subject<WsSVGElementModel[]> = new Subject();
    private currentPathSubject: Subject<WsSVGElementModel> = new Subject();
    private svgImg: WsSVGImageModel;

    // Getters
    private getUserId(): number {
        return this.identityService.currentUser.id;
    }
    public getCurrentToolSubject(): Subject<string> {
        return this.toolSubject;
    }
    public getPathSubjects(): Subject<WsSVGElementModel[]> {
        return this.pathSubjects;
    }
    public getCurrentPathSubject(): Subject<WsSVGElementModel> {
        return this.currentPathSubject;
    }
    public getPaths(): WsSVGElementModel[] {
        return this.drawingPaths;
    }
    // Setters
    public setCurrentTool(tool: string): void {
        this.currentTool = tool;
        this.toolSubject.next(tool);
    }
    public setCurrentPath(path: WsSVGElementModel) {
        this.currentPath = path;
        this.currentPathSubject.next(path);
    }
    // Methods
    public addPath(path: WsSVGElementModel) {
        this.drawingPaths.push(path);
        this.pathSubjects.next(this.drawingPaths);
    }
    public cleanDrawingPaths() {
        this.drawingPaths = [];
        this.pathSubjects.next([]);
    }

    public undoPath() {
        this.undoRedoAction(false);
    }

    public redoPath() {
        this.undoRedoAction(true);
    }

    private undoRedoAction(bool: boolean) {
        this.drawingPaths.sort((el, nextEl) => Date.parse(el.createDate) - Date.parse(nextEl.createDate));
        const undoPaths = this.drawingPaths.filter(el => el.createUserId === this.getUserId() && el.isDeleted === bool);
        if (undoPaths.length > 0) {
            const undoPath = undoPaths[bool ? 0 : undoPaths.length - 1];
            undoPath.isDeleted = !undoPath.isDeleted;
            this.updateSVGEl(undoPath);
        }
    }

    public drawBrush(points: PointModel, controlType, brushProps: IBrushProps) {
        this.currentPath.element = brushProps;
        this.drawingPoints.push(points);
        const brush =
            controlType === "bezier"
                ? this.createBezierWsElmBrush(this.drawingPoints)
                : this.createWsElmBrush(this.drawingPoints);
        this.setCurrentPath(brush);
    }

    public stopDrawingBrush(omitValue, controlType) {
        if (this.drawingPoints.length === 0) {
            return;
        }
        if (this.drawingPoints.length > 2) {
            this.drawingPoints = simplify(this.drawingPoints, omitValue, true);
        }
        const brush =
            controlType === "bezier"
                ? this.createBezierWsElmBrush(this.drawingPoints)
                : this.createWsElmBrush(this.drawingPoints);
        this.cleanUndoPath();
        this.addPath(brush);
        this.setCurrentPath(
            new WsSVGElementModel(
                {
                    fill: "#000",
                    stroke: "#000",
                    strokeWidth: "1px",
                    points: "",
                    controlType: "bezier",
                },
                this.getUserId(),
                this.getUserId(),
            ),
        );
    }

    private cleanUndoPath() {
        this.drawingPaths = this.drawingPaths.filter((e: WsSVGElementModel) => !e.isDeleted);
    }

    private createBezierWsElmBrush(pointsArr: PointModel[]): WsSVGElementModel {
        let points = `M${pointsArr[0].x},${pointsArr[0].y}`;
        if (pointsArr.length > 2) {
            const cubics = catmullRom2Bezier(pointsArr);
            cubics.forEach(e => (points += `C${e[0]},${e[1]},${e[2]},${e[3]},${e[4]},${e[5]}`));
        } else {
            points += `L${pointsArr[1].x},${pointsArr[1].y}`;
        }
        return this.createWsSVGEl({ ...this.currentPath.element, points });
    }

    private createWsElmBrush(pointsArr: PointModel[]): WsSVGElementModel {
        let points = "";
        pointsArr.forEach((p, i) => (points += i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`));
        return this.createWsSVGEl({ ...this.currentPath.element, points });
    }

    private createWsSVGEl(elm: IBrushProps | ITextProps): WsSVGElementModel {
        return new WsSVGElementModel(elm, this.getUserId(), this.getUserId());
    }

    public clearPreviousPoints() {
        this.drawingPoints = [];
    }

    public drawText(textProps: ITextProps) {
        const textElm = this.createWsSVGEl(textProps);
        this.addPath(textElm);
        this.saveSVGElToDb(textElm);
    }

    // API SEND/REQUEST
    private saveSVGElToDb(elm: WsSVGElementModel) {
        this.busy(true);
        this.Restangular
            .one("svg", this.svgImg.id.toString())
            .customPOST(elm, elm.id.toString())
            .finally(() => {
                this.busy(false);
            });
    }

    public findTargetText(pathId: number): IEditableTextProps {
        const index = this.drawingPaths.findIndex(e => e.id === pathId);
        const { element, createDate } = this.drawingPaths[index];
        return { ...element, index, createDate };
    }

    public cleanFrontEndElm(index: number) {
        const elm = this.drawingPaths[index];
        elm.isDeleted = true;
        this.updateSVGEl(elm);
    }

    private updateSVGEl(updatedElm: WsSVGElementModel) {
        this.busy(true);
        this.Restangular
            .one("svg", this.svgImg.id.toString())
            .customPUT(updatedElm, updatedElm.id.toString())
            .finally(() => {
                this.pathSubjects.next(this.drawingPaths);
                this.busy(false);
            });
    }

    private getPointAttributes(points: PointModel[]) {
        let attribute = "";
        points.forEach((point, index) => (attribute += index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`));
        return attribute;
    }
    // ===========================================================
    public saveWsSVGImgToDb(svgWidth, svgHeight) {
        this.cleanDrawingPaths();
        this.busy(true);
        this.svgImg = new WsSVGImageModel(svgHeight, svgWidth, this.getUserId(), this.getUserId());
        this.Restangular
            .one("svg", this.svgImg.id.toString())
            .customPOST(this.svgImg)
            .then(() => {
                this.autoLoadSVGElement();
                // [Confirmation:OK] Return value is not returned from server side.
                return;
            })
            .finally(() => {
                this.busy(false);
            });
    }

    public reloadSVGElement() {
        this.loadSVGElement(false);
    }

    public loadAllSVGElmByImgId(svgImageId: string) {
        this.svgImg.id = svgImageId;
        this.svgImg.lastUpdateDatetime = new Date(0).toISOString();
        this.loadSVGElement(true).then(() => {
            this.autoLoadSVGElement();
            return;
        });
    }

    public autoLoadSVGElement() {
        setInterval(() => {
            this.loadSVGElement(false);
        }, 60000);
    }

    private loadSVGElement(firstTimeLoad: boolean) {
        this.busy(true);
        return this.Restangular
            .one("svg", this.svgImg.id.toString())
            .get({
                since: this.svgImg.lastUpdateDatetime,
            })
            .then((svgImg: WsSVGImageModel) => {
                const tempWsSVGElmArr = [];
                svgImg.elements.forEach((WsSVGElement: WsSVGElementModel) => {
                    WsSVGElement.element = JSON.parse(WsSVGElement.element);
                    tempWsSVGElmArr.push(WsSVGElement);
                });
                this.drawingPaths = tempWsSVGElmArr;
                if (firstTimeLoad) {
                    this.cleanUndoPath();
                }
                this.pathSubjects.next(tempWsSVGElmArr);
                this.svgImg.lastUpdateDatetime = svgImg.lastUpdateDatetime;
            })
            .finally(() => {
                this.busy(false);
            });
    }
}
