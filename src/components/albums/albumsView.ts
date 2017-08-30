import ComponentBase from "../componentBase";

export default class AlbumsView extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appAlbumsView";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/albums/albumsView.html";
    }
}
