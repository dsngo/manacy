import AppDialog from "../appDialog";
import Models from "./../../models/models";
import WsEntryHelper from "./../../models/wsEntryHelper";

export default class WsEntryMediaDialog extends AppDialog {
    //
    // md-dialogがcomponentモデルに非対応のため、現時点ではComponent化しない
    //
    // /**
    //  * 登録コンポーネント名
    //  */
    // public static readonly IID: string = 'appWsEntryMediaDialog';

    // /**
    //  * コンポーネントオプション
    //  */
    // protected static setOptions(options: ng.IComponentOptions) {
    //     options.templateUrl = '../components/ws/WsEntryMediaDialog.html';
    // }

    /**
     * ダイアログ表示設定を返す
     * @param
     */
    public static getDialogOptions($event): ng.material.IDialogOptions {
        const options = super.getDialogOptions($event);
        options.templateUrl = "../components/ws/WsEntryMediaDialog.html";
        options.fullscreen = true;
        return options;
    }

    /**
     * 呼び出し元からdatabindされる
     * 例）dialogOption.locals = { entries: this.entries, index: 1 };
     */
    public entries: WsEntry.EntryArray;
    public index: number;

    /**
     * WsEntryHelperを$ctrlで使う
     */
    public readonly helper = WsEntryHelper;

    public get entryFilter() {
        return (value: Models.Dtos.WsEntryDto, index: number, array: WsEntry.EntryArray): boolean => {
            return (
                WsEntryHelper.isImage(value) ||
                WsEntryHelper.isVideo(value) ||
                WsEntryHelper.isAudio(value) ||
                WsEntryHelper.isFile(value)
            );
        };
    }

}
