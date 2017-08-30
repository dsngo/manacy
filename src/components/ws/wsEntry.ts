import WsElementBase from "./wsElementBase";

export default class WsEntry extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntry";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.templateUrl = "../components/ws/wsEntry.html";
    }

    public get elementType() {
        return this.property.elementTypeId;
    }

}
