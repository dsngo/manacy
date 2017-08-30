import Models from "./models";

// tslint:disable-next-line:no-namespace
declare global {

    type DtoIdType = number | string;

    /**
     * Ws関連インターフェイス
     */
    namespace Ws {
        /**
         * Ws User Group
         */
        interface IUserGroups {
            [groupName: string]: Models.Dtos.DisplayUserDto[];
        }
    }

    /**
     * WsEntry関連インターフェイス
     */
    namespace WsEntry {

        /**
         * Entry表示用コレクションのInterface
         */
        interface IEntryCollection {
            [userId: string]: EntryArray;
        }

        /**
         * Entryの配列型
         */
        type EntryArray = Models.Dtos.WsEntryDto[];

        /**
         * File情報型
         */
        interface IFile {
            fileId: string;
            fileName: string;
            contentType: string;
            size: number;
            uploadTime?: number;
        }

        /**
         * TextEntry設定情報
         */
        interface ISettings {
            text?: ITextSettings;
        }
        interface ITextSettings {
            label?: string;
            minLength?: number;
            maxLength?: number;
            rows?: number;
            defaultText?: string;
        }
        /**
         * TextEntry入力情報
         */
        interface IData {
            text?: string;
        }

        /**
         * ImageEntry設定情報
         */
        interface ISettings {
            image?: ImageSettings;
        }
        interface ImageSettings {
            minCount?: number;
            maxCount?: number;
            disableCaption?: boolean;
        }
        /**
         * ImageEntry入力情報
         */
        interface IData {
            file?: IFile;
            width?: number;
            height?: number;
            text?: string;
        }

        /**
         * AudioEntry設定情報
         */
        interface ISettings {
            audio?: IAudioSettings;
        }
        interface IAudioSettings {
            minCount?: number;
            maxCount?: number;
            disableCaption?: boolean;
        }
        /**
         * AudioEntry入力情報
         */
        interface IData {
            file?: IFile;
            duration?: number;
            text?: string;
        }

        /**
         * Video Entry
         */
        interface ISettings {
            video?: IVideoSettings;
        }
        interface IVideoSettings {
            minCount?: number;
            maxCount?: number;
            disableCaption?: boolean;
        }

        interface IData {
            file?: IFile;
            width?: number;
            height?: number;
            duration?: number;
            text?: string;
        }

        /**
         * File Entry
         */
        interface ISettings {
            file?: IFileSettings;
        }
        interface IFileSettings {
            extension?: string;
            disableCaption?: boolean;
        }
        interface IData {
            file?: IFile;
            text?: string;
        }

        /**
         * Chat Entry
         */
        interface ISettings {
            chat?: IChatSettings;
        }
        interface IChatSettings {

        }
        interface IData {
            text?: string;
        }

        /**
         * Discussion
         */
        interface ISettings {
            discussion?: IDiscussionSettings;
        }
        interface IDiscussionSettings {

        }
        interface IData {
            parentId?: DtoIdType;
            title?: string;
            text?: string;
        }

        /**
         * Selection
         */
        interface ISettings {
            selection?: ISelectionSettings;
        }
        interface ISelectionSettings {
            items: ISelectionItem[];
            maxSelections: number;
            minSelections?: number;
            isShowRight: boolean;
            isShowBorder: boolean;
        }
        interface ISelectionItem {
            label: string;
            text: string;
            disabled?: boolean;
        }
        interface IData {
            selectedIndex?: number[];
        }

        /**
         * FreeHand
         */
        interface ISettings {
            freeHand?: IFreeHandSettings;
        }
        interface IFreeHandSettings {
            disablePhoto?: boolean;
        }
        interface IData {
            width?: number;
            height?: number;
        }

    }
}
