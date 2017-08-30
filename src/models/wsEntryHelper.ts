import Models from "./models";
/**
 * WsEntryの各種操作を支援するHelper Class
 */
export default class WsEntryHelper {
    // Static Method
    // インスタンスを作成せずに使用可能

    public static isText(entry: Models.Dtos.WsEntryDto): boolean {
        return entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.text;
    }

    public static isImage(entry: Models.Dtos.WsEntryDto): boolean {
        return entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.image;
    }

    public static isVideo(entry: Models.Dtos.WsEntryDto): boolean {
        return entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.video;
    }

    public static isAudio(entry: Models.Dtos.WsEntryDto): boolean {
        return entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.audio;
    }

    public static isFile(entry: Models.Dtos.WsEntryDto): boolean {
        return entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.file;
    }

    /**
     * WsEntryを初期値として渡し、インスタンスを生成して各種メソッドを使うこともできる
     * @param _entry
     */
    public constructor(
        // tslint:disable-next-line:variable-name
        private _entry: Models.Dtos.WsEntryDto,
    ) { }

    public get isText() {
        return WsEntryHelper.isText(this._entry);
    }
    public get isImage() {
        return WsEntryHelper.isImage(this._entry);
    }
    public get isVideo() {
        return WsEntryHelper.isVideo(this._entry);
    }
    public get isAudio() {
        return WsEntryHelper.isAudio(this._entry);
    }
    public get isFile() {
        return WsEntryHelper.isFile(this._entry);
    }

}
