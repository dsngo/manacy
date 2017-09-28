/* tslint:disable:no-console */
import * as restangular from "restangular";
import { Subject } from "rxjs/Subject";
import uuidv4 from "../common/uuid";
import { BrushModel, IBrushProps } from "../models/BrushModel";
import { DrawModel } from "../models/drawModel";
import Models from "../models/models";
import { PointModel } from "../models/PointModel";
import { ITextProps, TextModel } from "../models/TextModel";
import { catmullRom2bezier } from "./catmullRom2bezier";
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
    private currentPath: TextModel | BrushModel;
    private drawingPaths: Array<TextModel | BrushModel>;
    private drawingPoints: PointModel[];
    private pathSubjects: Subject<Array<TextModel | BrushModel>> = new Subject();
    private currentPathSubject: Subject<TextModel | BrushModel> = new Subject();
    // Getters
    public getCurrentToolSubject(): Subject<string> {
        return this.toolSubject;
    }
    public getpathSubjects(): Subject<Array<TextModel | BrushModel>> {
        return this.pathSubjects;
    }
    public getCurrentPathSubject(): Subject<TextModel | BrushModel> {
        return this.currentPathSubject;
    }
    public getPaths(): Array<TextModel | BrushModel> {
        return this.drawingPaths;
    }
    // Setters
    public setCurrentTool(tool: string): void {
        this.toolSubject.next(tool);
    }
    public setCurrentPath(path: TextModel | BrushModel) {
        this.currentPath = path;
        this.currentPathSubject.next(this.currentPath);
    }
    // Methods
    public addPath(path: TextModel | BrushModel) {
        this.drawingPaths.push(path);
        this.pathSubjects.next(this.drawingPaths);
    }
    public cleanDrawingPaths() {
        this.drawingPaths = [];
        this.pathSubjects.next([]);
    }
    public undoRedoDraw(action: "undo" | "redo") {
        this.svgImage.elements.sort(
            (el: Models.Dtos.SvgElementDto, nextEl: Models.Dtos.SvgElementDto) =>
                Date.parse(el.createDate) - Date.parse(nextEl.createDate),
        );
        let elements;
        if (action === "undo") {
            elements = this.svgImage.elements.filter(
                (el: Models.Dtos.SvgElementDto) => el.createUserId === this.identityService.currentUser.id && !el.isDeleted,
            );
        }
        if (action === "redo") {
            elements = this.svgImage.elements.filter(
                (el: Models.Dtos.SvgElementDto) => el.createUserId === this.identityService.currentUser.id && el.isDeleted,
            );
        }
        if (elements.length > 0) {
            const undoPath = "redo" ? elements[0] : elements[elements.length - 1];
            this.updateSvgElement(undoPath);
        }
    }
    // public undoPath() {
    //     this.undoRedoDraw("undo");
    // }

    // public redoPath() {
    //     this.undoRedoDraw("redo");
    // }

    // private undoRedoAction(isUndo: boolean) {
    //     this.drawingPath = this.drawingPath.sort((el, nextEl) => {
    //         if (new Date(el.svgElementDto.createDate) > new Date(nextEl.svgElementDto.createDate)) {
    //             return 1;
    //         }
    //         return -1;
    //     });
    //     const undoPaths = this.drawingPath.filter((el: PathModel) => {
    //         return el.svgElementDto.createUserId === this.identityService.currentUser.id && el.svgElementDto.isDeleted === isUndo;
    //     });
    //     if (undoPaths.length > 0) {
    //         const undoPath = isUndo ? undoPaths[0] : undoPaths[undoPaths.length - 1];
    //         this.updateSvgElement(undoPath.svgElementDto);
    //     }
    // }

    // public clearDrawingPaths() {
    //     this.drawingPath = [];
    //     this.pathSubjects.next(this.drawingPath);
    // }

    // private cleanUndoPath() {
    //     this.drawingPath = this.drawingPath.filter(el => {
    //         return !el.svgElementDto.isDeleted;
    //     });
    // }

    public startDraw() {
        this.drawingPoints = [];
    }

    public getCurrentSVG() {
        return this.svgImage;
    }

    public drawText(textProps: ITextProps) {
        const newText: TextModel = new TextModel(textProps);
        this.addPath(newText);
        const newElements = this.constructElementVal(newText);
        this.createSVGElement(newElements);
    }

    public findEditableText(textId: number) {
        const index = this.drawingText.findIndex(e => e.textSettings.textId === textId);
        const foundText = this.drawingText[index];
        const params = {
            text: foundText.textSettings.textValue.join("\n"),
            x: foundText.textSettings.positionX,
            y: foundText.textSettings.positionY,
            index,
            color: foundText.textSettings.color,
            bold: foundText.textSettings.isBold,
            fontSize: foundText.textSettings.fontSize,
        };
        return params;
    }

    public cleanText(index) {
        console.log("clean text");

        const element = this.drawingText[index].constructElement();
        // @son: find the element in svg image to update
        this.svgImage.elements.map((elm: Models.Dtos.SvgElementDto) => {
            if (element === elm.element) {
                this.updateSvgElement(elm);
                console.log(elm);

                // @son: remove the element in local texts
                this.drawingText.splice(index, 1);
            }
        });
        // this.updateSvgElement(this.drawingText[index].svgElementDto);
    }

    public drawing(x, y, controlType, drawModel) {
        this.drawModel = drawModel;
        this.drawingPoints.push(new PointModel(x, y));
        let brush: BrushModel;
        // let path: PathModel;
        if (controlType === "bezier") {
            // path = this.createPathWithBezier(this.drawingPoints);
            brush = this.createBrushWithBezier(this.drawingPoints);
        } else {
            // path = this.createPath(this.drawingPoints);
            brush = this.createBrush(this.drawingPoints);
        }
        // this.setCurrentPath(path);
        this.setCurrentBrush(brush);
    }

    public stopDraw(omitValue, controlType) {
        if (this.drawingPoints.length === 0) {
            return;
        }
        this.drawingPoints = simplify(this.drawingPoints, omitValue, true);
        // let path: PathModel;
        // if (controlType === "bezier") {
        //     path = this.createPathWithBezier(this.drawingPoints);
        // } else {
        //     path = this.createPath(this.drawingPoints);
        // }
        // path.svgElementDto = this.makeSVGElement(path);
        const brushSettings: IBrushProps = {
            stroke: this.drawModel.color,
            strokeWidth: this.drawModel.stroke + "px",
            points: this.getAttribute(this.drawingPoints),
            fill: this.drawModel.color,
        };
        const brush: BrushModel = new BrushModel(brushSettings);
        const element = this.constructElementVal(brush);
        // this.cleanUndoPath();
        this.addBrush(brush);
        this.createSVGElement(element);
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

    private createBrush(points: PointModel[]): BrushModel {
        let attribute: string = "";
        points.forEach((point, index) => {
            if (index === 0) {
                attribute += `M${point.x}, ${point.y}`;
            } else {
                attribute += `L${point.x}, ${point.y}`;
            }
        });
        const settings: IBrushProps = {
            brushId: Date.now(),
            points: attribute,
            stroke: this.drawModel.color,
            strokeWidth: this.drawModel.stroke + "px",
            fill: this.drawModel.color,
            currentTool: "line",
            color: this.drawModel.color,
        };
        const brush: BrushModel = new BrushModel(settings);
        return brush;
    }

    private getAttribute(points: PointModel[]) {
        let attribute: string = "";
        points.forEach((point, index) => {
            if (index === 0) {
                attribute += `M${point.x}, ${point.y}`;
            } else {
                attribute += `L${point.x}, ${point.y}`;
            }
        });
        return attribute;
    }

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

    private createBrushWithBezier(points: PointModel[]): BrushModel {
        const cubics = catmullRom2bezier(points);
        let attribute = `M${points[0].x}, ${points[0].y}`;
        for (const i of cubics) {
            if (i === cubics.length - 1) {
                attribute += `M${cubics[i][0]},${cubics[i][1]}, ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
            } else {
                attribute += `C${cubics[i][0]},${cubics[i][1]}, ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
            }
        }
        const brushSettings: IBrushProps = {
            brushId: Date.now(),
            points: attribute,
            stroke: this.drawModel.color,
            strokeWidth: this.drawModel.stroke + "px",
            fill: this.drawModel.color,
            currentTool: "line",
            color: this.drawModel.color,
        };
        const brush: BrushModel = new BrushModel(brushSettings);
        return brush;
    }

    // API call
    private timeAtOffset(o?: number): string {
        return (o !== undefined ? new Date(o) : new Date()).toISOString();
    }

    public svgImage: Models.Dtos.SvgImageDto;

    public createSVGImage(svgWidth, svgHeight) {
        this.cleanDrawingPaths();
        this.busy(true);

        this.svgImage = {
            id: uuidv4(),
            viewHeight: svgHeight,
            viewWidth: svgWidth,
            elements: [],
            lastUpdateDatetime: this.timeAtOffset(),
            isDeleted: false,
            updateDate: this.timeAtOffset(),
            createDate: this.timeAtOffset(),
            updateUserId: this.identityService.currentUser.id,
            createUserId: this.identityService.currentUser.id,
        };
        this.Restangular
            .one("svg", this.svgImage.id.toString())
            .customPOST(this.svgImage)
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
            updateUserId: this.identityService.currentUser.id,
            createUserId: this.identityService.currentUser.id,
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

    private createSVGElement(svgElement: Models.Dtos.SvgElementDto) {
        this.busy(true);
        this.Restangular
            .one("svg", this.svgImage.id.toString())
            .customPOST(svgElement, svgElement.id.toString())
            .then(() => {
                // [Confirmation:OK] Return value is not returned from server side.
                // this.reloadSVGElement();
                return;
            })
            .finally(() => {
                this.busy(false);
            });
    }

    public reloadSVGElement() {
        console.log("reload");
        this.loadSVGElement(false);
    }

    public loadSVGImage(svgImageId: string) {
        this.svgImage = {
            id: svgImageId,
            lastUpdateDatetime: this.timeAtOffset(0),
            viewWidth: 0,
            viewHeight: 0,
            isDeleted: false,
            elements: [],
            updateDate: this.timeAtOffset(0),
            createDate: this.timeAtOffset(0),
            updateUserId: this.identityService.currentUser.id,
            createUserId: this.identityService.currentUser.id,
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
        console.log(this.svgImage);
        return this.Restangular
            .one("svg", this.svgImage.id.toString())
            .get({
                since: this.svgImage.lastUpdateDatetime,
            })
            .then((svgImg: Models.Dtos.SvgImageDto) => {
                // const tempPath: PathModel[] = [];
                const tempText: TextModel[] = [];
                const tempBrush: BrushModel[] = [];
                // this.svgImage.elements = [];
                svgImg.elements.forEach((svgElement: Models.Dtos.SvgElementDto) => {
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
                this.svgImage = svgImg;
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

    private updateSvgElement(updateSvg: Models.Dtos.SvgElementDto) {
        this.busy(true);
        updateSvg.isDeleted = !updateSvg.isDeleted;
        this.Restangular
            .one("svg", this.svgImage.id.toString())
            .customPUT(updateSvg, updateSvg.id.toString())
            .then(() => {
                // this.pathSubjects.next(this.drawingPath);

                return;
            })
            .finally(() => {
                // @son: reload SVG from server when finish the update
                this.reloadSVGElement();
                this.busy(false);
            });
    }

    public stringifyPath(jsonObjToDatabase: TextModel | BrushModel): string {
        return JSON.stringify(jsonObjToDatabase);
    }

    public parseSVGElement(svgElementFromDatabase: string) {
        const elementObj: IBrushProps | ITextProps = JSON.parse(svgElementFromDatabase);
        return elementObj;
    }
}
