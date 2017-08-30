import ComponentBase from "../componentBase";

// 仮アルバムインタフェース
interface IDummyAlbum {
    name: string;
    date: string;
    time: string;
}

export default class AlbumsNav extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appAlbumsNav";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        options.templateUrl = "../components/albums/albumsNav.html";
    }

    // 仮表示用
    public albums: IDummyAlbum[] = [
        {name: "test00", date: "2017/07/01", time: "09:00:00"},
        {name: "test01", date: "2017/07/02", time: "09:00:00"},
        {name: "test02", date: "2017/07/03", time: "09:00:00"},
    ];

    /**
     * 選択中のアルバム
     */
    public selectingAlbum: IDummyAlbum;

    /**
     * アルバムを選択する。
     * @param album
     */
    public selectAlbum(album: IDummyAlbum) {
        this.selectingAlbum = album;
    }

    /**
     * 選択しているアルバムかを判定する。
     * @param album
     * @return {boolean}
     */
    public hasSelectAlbum(album: IDummyAlbum) {
        return this.selectingAlbum === album;
    }
}
