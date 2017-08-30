/**
 * C# DataTypeのカスタマイズ
 * TypeLiteで自動生成されたinterfaceをカスタマイズしたい場合、TypeLite側で[ignore] annotationを追加してメンバーを無視し、
 * このファイルでメンバーを手動で追加する。
 */
// tslint:disable-next-line:no-namespace
declare namespace Anzas.Manacy.Models.Dtos {

    // tslint:disable-next-line:interface-name
    interface WsElementContentDto {
        entrySettings: WsEntry.ISettings;
    }

    // tslint:disable-next-line:interface-name
    interface WsEntryDto {
        jsonData: WsEntry.IData;
    }
}
