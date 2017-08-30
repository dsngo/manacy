import ComponentBase from "../componentBase";
import IdentityService from "../../services/IdentityService";

export default class TemplatesView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appTemplatesView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/templates/templatesView.html";
    }

    public title: string;

    public static $inject = [IdentityService.IID];

    public constructor(
    ) {
        super();
    }
}