import * as angular from "angular";
import { DrawModel } from "../../models/drawModel";
import Models from "../../models/models";
import { PathModel } from "../../models/pathModel";
import DrawService from "../../Services/drawService";
import ComponentBase from "../componentBase";

export default class AppDrawingPaint extends ComponentBase {
    public static readonly IID: string = "paintComponent";

    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);

        options.templateUrl = "../components/drawing/appDrawingPaint.html";
        options.controllerAs = "paintCtrl";
        options.bindings = {
            svgImgId: "@",
            // isNewPaint: '<'
        };
    }
    private drawModel: DrawModel = new DrawModel();
    private isNewPaint: boolean;
    private svgImgId: string;
    public static $inject = ["drawService", "$window"];

    public constructor(private drawService: DrawService, private window: ng.IWindowService) {
        super();
        if (this.svgImgId === "") {
            this.drawService.clearDrawingPaths();
            this.drawService.createSVGImage(this.window.innerWidth, this.window.innerHeight);
        } else {
            this.drawService.loadSVGImage(this.svgImgId);
        }
    }
}
