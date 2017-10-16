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
    private toolSubject: Subject<string> = new Subject();
    private currentPath: WsSVGElementModel;
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
        this.toolSubject.next(tool);
    }
    public setCurrentPath(path: WsSVGElementModel) {
        this.currentPath = path;
        this.currentPathSubject.next(this.currentPath);
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
        this.drawingPoints.push(points);
        const brush =
            controlType === "bezier" ? this.createBrushWithBezier(this.drawingPoints) : this.createBrush(this.drawingPoints);
        this.setCurrentPath(brush);
    }

    private createBrushWithBezier(pointsArr: PointModel[]): WsSVGElementModel {
        const cubics = catmullRom2Bezier(pointsArr);
        let points = `M${pointsArr[0].x},${pointsArr[0].y} `;
        cubics.forEach(e => (points += `C${e[0]},${e[1]},${e[2]},${e[3]},${e[4]},${e[5]} `));
        return this.createBrushSVGEl(this.currentPath.element, points);
    }

    private createBrush(pointsArr: PointModel[]): WsSVGElementModel {
        let points = "";
        pointsArr.forEach((p, i) => (points += i === 0 ? `M${p.x},${p.y} ` : `L${p.x},${p.y} `));
        return this.createBrushSVGEl(this.currentPath.element, points);
    }

    private createBrushSVGEl(elm: IBrushProps, points: string) {
        const { fill, stroke, strokeWidth } = elm as IBrushProps;
        return this.createWsSVGEl(elm);
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
        points.forEach((point, index) => (attribute += index === 0 ? `M${point.x},${point.y} ` : `L${point.x},${point.y} `));
        return attribute;
    }
    // ===========================================================

    public stopDrawingBrush(omitValue, controlType) {
        if (this.drawingPoints.length === 0) {
            return;
        }
        this.drawingPoints = simplify(this.drawingPoints, omitValue, true);

        const brushProps: IBrushProps = {
            controlType,
            stroke: this.currentPath.element.color,
            strokeWidth: this.currentPath.stroke + "px",
            points: this.getPointAttributes(this.drawingPoints),
            fill: this.currentPath.color,
        };
        const elm = this.createWsSVGEl(brushProps);
        const brush: BrushModel = new BrushModel(brushProps);
        const element = this.constructElementVal(brush);
        // this.cleanUndoPath();
        this.addPath(brush);
        this.saveSVGElToDb(element);
        // return this.setCurrentPath(null);
        return this.setCurrentBrush(null);
    }

    // private createPath(points: PointModel[]): PathModel {
    //     let attribute: string = "";
    //     points.forEach((point, index) => {
    //         if (index === 0) {
    //             attribute += `M${point.x}, ${point.y}`;
    //         } else {
    //             attribute += `L${point.x}, ${point.y}`;
    //         }
    //     });
    //     return this.setPath(attribute);
    // }

    // private createPathWithBezier(points: PointModel[]): PathModel {
    //     const cubics = catmullRom2bezier(points);
    //     let attribute = `M${points[0].x}, ${points[0].y}`;
    //     for (let i = 0; i < cubics.length; i++) {
    //         if (i === cubics.length - 1) {
    //             attribute += `M${cubics[i][0]},${cubics[i][1]}, ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]} `;
    //         } else {
    //             attribute += `C${cubics[i][0]},${cubics[i][1]}, ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
    //         }
    //     }
    //     return this.setPath(attribute);
    // }

    // private setPath(attribute: string): PathModel {
    //     const path = new PathModel();
    //     path.pathId = Date.now();
    //     path.points = attribute;
    //     path.stroke = this.drawModel.color;
    //     path.strokeWidth = this.drawModel.stroke + "px";
    //     return path;
    // }

    // API call
    private timeAtOffset(o?: number): string {
        return (o !== undefined ? new Date(o) : new Date()).toISOString();
    }

    public createSVGImage(svgWidth, svgHeight) {
        this.cleanDrawingPaths();
        this.busy(true);
        this.svgImg = new WsSVGImageModel(svgHeight, svgWidth, this.getUserId(), this.getUserId());

        // this.svgImage = {
        //     id: uuidv4(),
        //     viewHeight: svgHeight,
        //     viewWidth: svgWidth,
        //     elements: [],
        //     lastUpdateDatetime: this.timeAtOffset(),
        //     isDeleted: false,
        //     updateDate: this.timeAtOffset(),
        //     createDate: this.timeAtOffset(),
        //     updateUserId: this.identityService.currentUser.id,
        //     createUserId: this.identityService.currentUser.id,
        // };
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

    private constructElementVal(path: TextModel | BrushModel) {
        return {
            id: uuidv4(),
            element: this.stringifyPath(path),
            isDeleted: false,
            updateDate: this.timeAtOffset(),
            createDate: this.timeAtOffset(),
            updateUserId: this.getUserId(),
            createUserId: this.getUserId(),
        };
    }

    // private makeSVGElement(pathElement: PathModel) {
    //     return {
    //         id: uuidv4(),
    //         element: pathElement.getSVGElement(),
    //         isDeleted: false,
    //         updateDate: this.timeAtOffset(),
    //         createDate: this.timeAtOffset(),
    //         updateUserId: this.identityService.currentUser.id,
    //         createUserId: this.identityService.currentUser.id,
    //     };
    // }

    public reloadSVGElement() {
        console.log("reload");
        this.loadSVGElement(false);
    }

    public loadSVGImage(svgImageId: string) {
        this.svgImg = {
            id: svgImageId,
            lastUpdateDatetime: this.timeAtOffset(0),
            viewWidth: 0,
            viewHeight: 0,
            isDeleted: false,
            elements: [],
            updateDate: this.timeAtOffset(0),
            createDate: this.timeAtOffset(0),
            updateUserId: this.getUserId(),
            createUserId: this.getUserId(),
        };
        this.loadSVGElement(true).then(() => {
            this.autoLoadSVGElement();
            return;
        });
    }

    public autoLoadSVGElement() {
        setInterval(() => {
            this.loadSVGElement(false);
        }, 60 * 1000);
    }

    private loadSVGElement(firstTimeLoad: boolean) {
        this.busy(true);
        console.log(this.svgImg);
        return this.Restangular
            .one("svg", this.svgImg.id.toString())
            .get({
                since: this.svgImg.lastUpdateDatetime,
            })
            .then((svgImg: Models.Dtos.SvgImageDto) => {
                // const tempPath: PathModel[] = [];
                const tempText: TextModel[] = [];
                const tempBrush: BrushModel[] = [];
                // this.svgImage.elements = [];
                svgImg.elements.forEach((svgElement: WsSVGElementModel) => {
                    const elm = JSON.parse(svgElement.element);
                    const elementModel = this.getElement(elm, tempBrush, tempText);
                    // const path = PathModel.parseString(svgElement);
                    // tempPath.splice(0, tempPath.length, path);
                    // this.svgImage.elements.push(svgElement);
                });
                // this.svgImage.elements.forEach((svgElement) => {
                //     // console.log(svgElement); // tslint:disable-line
                //     const path = PathModel.parseString(svgElement);
                //     tempPath.push(path);
                // });

                // this.drawingPath = tempPath;
                this.drawingText = tempText;
                this.drawingBrush = tempBrush;

                if (firstTimeLoad) {
                    // this.cleanUndoPath();
                }
                this.svgImg = svgImg;
                this.textsSubject.next(this.drawingText);
                this.brushesSubject.next(this.drawingBrush);
            })
            .finally(() => {
                this.busy(false);
            });
    }

    private getElement(element, tempBrush, tempText) {
        if (element.brushId) {
            const settings: IBrushProps = {
                points: element.points,
                stroke: element.stroke,
                strokeWidth: element.strokeWidth,
                fill: element.color,
            };
            const brush = new BrushModel(settings);
            tempBrush.push(brush);
            return brush;
        } else {
            const settings: ITextProps = {
                fontSize: element.fontSize,
                color: element.color,
                pX: element.positionX || 1,
                pY: element.positionY || 1,
                textValue: element.textValue,
                isBold: element.isBold,
            };
            const text = new TextModel(settings);
            tempText.push(text);
            return text;
        }
    }

    public stringifyPath(jsonObjToDatabase: TextModel | BrushModel): string {
        return JSON.stringify(jsonObjToDatabase);
    }

    public parseSVGElement(svgElementFromDatabase: string) {
        const elementObj: IBrushProps | ITextProps = JSON.parse(svgElementFromDatabase);
        return elementObj;
    }
}
