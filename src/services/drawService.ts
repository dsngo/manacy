import * as restangular from "restangular";
import { Subject } from "rxjs/Subject";
import uuidv4 from "../common/uuid";
import { DrawModel } from "../models/drawModel";
import Models from "../models/models";
import { PathModel } from "../models/pathModel";
import { PointModel } from "../models/pointModel";
import { catmullRom2bezier } from "./catmullRom2bezier";
import { simplify } from "./drawSimplify";
import IdentityService from "./IdentityService";
import ServiceBase from "./serviceBase";

export default class DrawService extends ServiceBase {
    public static readonly IID = "drawService";

    public static $inject = ["Restangular", "$q", IdentityService.IID];

    private drawModel: DrawModel = new DrawModel();
    private drawingPath: PathModel[] = [];
    private pathsSubject: Subject<PathModel[]> = new Subject<PathModel[]>();
    private currentPathSubject: Subject<PathModel> = new Subject<PathModel>();
    private currentPath: PathModel = null;

    private drawingPoints: PointModel[] = [];

    public constructor(
        protected Restangular: restangular.IService,
        protected $q: ng.IQService,
        protected identityService: IdentityService,
    ) {
        super();
    }

    public getPathsSubject(): Subject<PathModel[]> {
        return this.pathsSubject;
    }

    public getCurrentPathSubject(): Subject<PathModel> {
        return this.currentPathSubject;
    }

    public setCurrentPath(path: PathModel) {
        this.currentPath = path;
        this.currentPathSubject.next(this.currentPath);
    }

    public addPath(path: PathModel) {
        this.drawingPath.push(path);
        this.pathsSubject.next(this.drawingPath);
    }

    public undoPath() {
        this.undoRedoAction(false);
    }

    public redoPath() {
        this.undoRedoAction(true);
    }

    private undoRedoAction(isUndo: boolean) {
        this.drawingPath = this.drawingPath.sort((el, nextEl) => {
            if (new Date(el.svgElementDto.createDate) > new Date(nextEl.svgElementDto.createDate)) {
                return 1;
            }
            return -1;
        });
        const undoPaths = this.drawingPath.filter((el: PathModel) => {
            return el.svgElementDto.createUserId === this.identityService.currentUser.id && el.svgElementDto.isDeleted === isUndo;
        });
        if (undoPaths.length > 0) {
            const undoPath = isUndo ? undoPaths[0] : undoPaths[undoPaths.length - 1];
            this.updateSvgElement(undoPath.svgElementDto);
        }
    }

    public clearDrawingPaths() {
        this.drawingPath = [];
        this.pathsSubject.next(this.drawingPath);
    }

    private cleanUndoPath() {
        this.drawingPath = this.drawingPath.filter(el => {
            return !el.svgElementDto.isDeleted;
        });
    }

    public startDraw() {
        this.drawingPoints = [];
    }

    public drawText(point: PointModel, drawModel: DrawModel, textValue: string, createdDate?: string) {
        const path: PathModel = new PathModel();
        path.pathId = Date.now();
        path.textPoint = point;
        path.textValue = textValue.split("\n");
        path.stroke = drawModel.color;
        path.fontSize = drawModel.fontSize;
        path.isText = true;
        if (drawModel.isTextBold) {
            path.textBold = drawModel.color;
        }
        this.cleanUndoPath();
        path.svgElementDto = this.makeSVGElement(path, createdDate || this.timeAtOffset());
        this.addPath(path);
        this.createSVGElement(path.svgElementDto);
    }

    public findEditableText(textId: number) {
        const index = this.drawingPath.findIndex(e => e.pathId === textId);
        const foundText = this.drawingPath[index];
        const params = {
            text: foundText.textValue.join("\n"),
            x: foundText.textPoint.x,
            y: foundText.textPoint.y,
            index,
            color: foundText.stroke,
            bold: foundText.textBold !== "none",
            fontSize: foundText.fontSize,
            createdDate: foundText.svgElementDto.createDate,
        };
        return params;
    }

    public cleanText(index) {
        this.updateSvgElement(this.drawingPath[index].svgElementDto);
    }

    public drawing(x, y, controlType, drawModel) {
        this.drawModel = drawModel;
        this.drawingPoints.push(new PointModel(x, y));
        let path: PathModel;
        if (controlType === "bezier") {
            path = this.createPathWithBezier(this.drawingPoints);
        } else {
            path = this.createPath(this.drawingPoints);
        }
        this.setCurrentPath(path);
    }

    public stopDraw(omitValue, controlType) {
        if (this.drawingPoints.length === 0) {
            return;
        }
        this.drawingPoints = simplify(this.drawingPoints, omitValue, true);
        let path: PathModel;
        if (controlType === "bezier") {
            path = this.createPathWithBezier(this.drawingPoints);
        } else {
            path = this.createPath(this.drawingPoints);
        }
        path.svgElementDto = this.makeSVGElement(path, this.timeAtOffset());
        this.cleanUndoPath();
        this.addPath(path);
        this.createSVGElement(path.svgElementDto);
        return this.setCurrentPath(null);
    }

    private createPath(points: PointModel[]): PathModel {
        let attribute: string = "";
        points.forEach((point, index) => {
            if (index === 0) {
                attribute += `M${point.x}, ${point.y}`;
            } else {
                attribute += `L${point.x}, ${point.y}`;
            }
        });
        return this.setPath(attribute);
    }

    private createPathWithBezier(points: PointModel[]): PathModel {
        const cubics = catmullRom2bezier(points);
        const cLen = cubics.length;
        let attribute = `M${points[0].x}, ${points[0].y}`;
        for (let i = 0; i < cLen; i++) {
            attribute += `C${cubics[i][0]},${cubics[i][1]}, ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
        }
        return this.setPath(attribute);
    }

    private setPath(attribute: string): PathModel {
        const path = new PathModel();
        path.pathId = Date.now();
        path.points = attribute;
        path.stroke = this.drawModel.color;
        path.strokeWidth = this.drawModel.stroke + "px";
        return path;
    }

    // API call
    private timeAtOffset(o?: number): string {
        return (o >= 0 ? new Date(o) : new Date()).toISOString();
    }

    public svgImage: Models.Dtos.SvgImageDto;

    public createSVGImage(svgWidth, svgHeight) {
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

    private makeSVGElement(pathElement: PathModel, createdDate: string): Models.Dtos.SvgElementDto {
        return {
            id: uuidv4(),
            element: pathElement.getSVGElement(),
            isDeleted: false,
            updateDate: this.timeAtOffset(),
            createDate: createdDate,
            updateUserId: this.identityService.currentUser.id,
            createUserId: this.identityService.currentUser.id,
        };
    }

    private createSVGElement(svgElement: Models.Dtos.SvgElementDto) {
        this.busy(true);
        this.Restangular
            .one("svg", this.svgImage.id.toString())
            .customPOST(svgElement, svgElement.id.toString())
            .then(() => {
                // [Confirmation:OK] Return value is not returned from server side.
                return;
            })
            .finally(() => {
                this.busy(false);
            });
    }

    public loadSVGImage(svgImageId: string) {
        this.svgImage = {
            id: svgImageId,
            lastUpdateDatetime: this.timeAtOffset(0),
            viewWidth: 0,
            viewHeight: 0,
            isDeleted: false,
            elements: [],
            updateDate: this.timeAtOffset(),
            createDate: this.timeAtOffset(),
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
        return this.Restangular
            .one("svg", this.svgImage.id.toString())
            .get({
                since: this.svgImage.lastUpdateDatetime,
            })
            .then((svgImg: Models.Dtos.SvgImageDto) => {
                const tempPath: PathModel[] = [];
                svgImg.elements.forEach((svgElement: Models.Dtos.SvgElementDto) => {
                    const path = PathModel.parseString(svgElement);
                    tempPath.splice(0, tempPath.length, path);
                    this.svgImage.elements.push(svgElement);
                });

                this.svgImage.elements.forEach((svgElement: Models.Dtos.SvgElementDto) => {
                    const path = PathModel.parseString(svgElement);
                    tempPath.push(path);
                });

                this.drawingPath = tempPath;

                if (firstTimeLoad) {
                    this.cleanUndoPath();
                }

                this.pathsSubject.next(this.drawingPath);
                this.svgImage.lastUpdateDatetime = svgImg.lastUpdateDatetime;
            })
            .catch(() => console.log("Update from Database...")) // tslint:disable-line
            .finally(() => {
                this.busy(false);
            });
    }

    private updateSvgElement(updateSvg: Models.Dtos.SvgElementDto) {
        this.busy(true);
        updateSvg.isDeleted = !updateSvg.isDeleted;
        this.Restangular
            .one("svg", this.svgImage.id.toString())
            .customPUT(updateSvg, updateSvg.id.toString())
            .then(() => {
                this.pathsSubject.next(this.drawingPath);
                return;
            })
            .finally(() => {
                this.busy(false);
            });
    }
}
