/**
 * appDrawing.ts
 * SVG Free Hand Drawing Component
 *
 * bezier曲線により、マウス軌跡をスムージング
 * http://qiita.com/kwst/items/16e4877890a19826ba7f
 * https://github.com/SatoshiKawabata/SVGCatmullRomSpline
 * https://codepen.io/kwst/pen/vgGgqN
 */
import * as angular from "angular";
import * as _ from "lodash";
import ComponentBase from "./componentBase";
import { simplify } from "./simplify";

export default class AppDrawing extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appDrawing";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/appDrawing.html";
    }

    /**
     * InjectするService
     */
    public static $inject = ["$scope", "$element"];

    /**
     * コンストラクタ
     * @param wsService
     */
    public constructor(
        public $scope: ng.IScope,
        public $element: ng.IRootElementService,
    ) {
        super();
    }

    private container: HTMLElement;
    private control: HTMLElement; // = document.getElementById('control');
    private omit: HTMLElement; // = document.getElementById('omit');
    private omitLabel: HTMLElement; // = document.getElementById('omit-label');

    private isDrawing = false;
    private drawingPoints;
    private drawingPath: SVGPathElement;
    private readonly defaultPathStyle = {
        strokeWidth: "3px",
        stroke: "#000",
        fill: "none",
    };

    protected $postLink(): void {
        this.container = this.$element.find("svg")[0];
        this.control = this.$element.find("select")[0];
        this.omit = this.$element.find("input")[0];
        this.omitLabel = this.$element.find("label")[0];

        this.container.addEventListener("mousedown", (e) => {
            this.isDrawing = true;
            this.drawingPoints = [];
        });

        this.container.addEventListener("mousemove", (e: any) => {
            if (this.isDrawing) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.drawingPoints.push({ x, y });
                if (this.drawingPath) {
                    this.container.removeChild(this.drawingPath);
                }
                if (this.control["value"] === "bezier") {
                    this.drawingPath = this.createPathWithBezier(this.drawingPoints);
                } else {
                    this.drawingPath = this.createPath(this.drawingPoints);
                }
                // Object.assign(this.drawingPath.style, this.defaultPathStyle);
                _.assign(this.drawingPath.style, this.defaultPathStyle);
                this.container.appendChild(this.drawingPath);
            }
        });

        this.container.addEventListener("mouseup", (e) => {
            this.isDrawing = false;
            if (!this.drawingPath) {
                return;
            }
            this.container.removeChild(this.drawingPath);
            this.drawingPath = null;
            // console.log("drawingPoints", JSON.stringify(drawingPoints.map(point => [point.x, point.y])));
            this.drawingPoints = simplify(this.drawingPoints, parseFloat(this.omit["value"]), true);
            let path: SVGPathElement;
            if (this.control["value"] === "bezier") {
                path = this.createPathWithBezier(this.drawingPoints);
            } else {
                path = this.createPath(this.drawingPoints);
            }
            // console.log(path);
            // Object.assign(path.style, this.defaultPathStyle);
            _.assign(path.style, this.defaultPathStyle);
            this.container.appendChild(path);
        });
    }

    public clear() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    private createPath(points): SVGPathElement {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let attribute = "";
        points.forEach((point, index) => {
            if (index === 0) {
                attribute += `M${point.x}, ${point.y}`;
            } else {
                attribute += `L${point.x}, ${point.y}`;
            }
        });
        path.setAttributeNS(null, "d", attribute);
        return path;
    }

    private createPathWithBezier(points): SVGPathElement {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const cubics = this.catmullRom2bezier(points);
        let attribute = `M${points[0].x}, ${points[0].y}`;
        for (const i of cubics) {
            // tslint:disable-next-line:max-line-length
            attribute += `C${cubics[i][0]},${cubics[i][1]} ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
        }

        path.setAttributeNS(null, "d", attribute);
        return path;
    }

    private catmullRom2bezier(pts) {
        const cubics = [];
        for (let i = 0, iLen = pts.length; i < iLen; i++) {
            const p = [
                pts[i - 1],
                pts[i],
                pts[i + 1],
                pts[i + 2],
            ];
            if (i === 0) {
                p[0] = {
                    x: pts[0].x,
                    y: pts[0].y,
                };
            }
            if (i === iLen - 2) {
                p[3] = {
                    x: pts[iLen - 2].x,
                    y: pts[iLen - 2].y,
                };
            }
            if (i === iLen - 1) {
                p[2] = {
                    x: pts[iLen - 1].x,
                    y: pts[iLen - 1].y,
                };
                p[3] = {
                    x: pts[iLen - 1].x,
                    y: pts[iLen - 1].y,
                };
            }
            const val = 6;
            cubics.push([
                (-p[0].x + val * p[1].x + p[2].x) / val,
                (-p[0].y + val * p[1].y + p[2].y) / val,
                (p[1].x + val * p[2].x - p[3].x) / val,
                (p[1].y + val * p[2].y - p[3].y) / val,
                p[2].x,
                p[2].y,
            ]);
        }
        return cubics;
    }

}
