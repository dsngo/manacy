import IdentityService from "../../services/IdentityService";
import UploadService from "../../services/uploadService";
import UserService from "../../services/userService";
import WsAssignmentService from "../../services/wsAssignmentService";
import Models from "./../../models/models";
import WsDrawingDialog from "./wsDrawingDialog";
import WsElementBase from "./wsElementBase";

export default class WsEntryBasicInput extends WsElementBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsEntryBasicInput";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.bindings["hideHeader"] = "<";
        options.templateUrl = "../components/ws/wsEntryBasicInput.html";
    }

    /**
     * InjectするService
     */
    public static $inject =
    [WsAssignmentService.IID, UserService.IID, IdentityService.IID, "$scope", "$interval", "$mdDialog", "$element", UploadService.IID];

    /**
     * コンストラクタ
     * @param wsAssignmentService
     */
    public constructor(
        public wsAssignmentService: WsAssignmentService,
        public userService: UserService,
        public identityService: IdentityService,
        public $scope: ng.IScope,
        public $interval: ng.IIntervalService,
        public $mdDialog: ng.material.IDialogService,
        public $element: any,
        public uploadService: UploadService,
    ) {
        super(wsAssignmentService, userService, identityService, $scope);
    }

    public hideHeader: boolean;

    private textEntryId: number = 0;
    public textEntry: string = "";
    public entries: WsEntry.EntryArray;

    protected $onInit(): void {
        super.$onInit();

        // textarea rowsの変更が更新されないため、時間差をおいて再描画させる
        const entrySettings = this.element.content.entrySettings;
        const thisComponent = this;
        this.$scope.$watch(
            () => {
                return "text" in entrySettings ? entrySettings.text.rows : null;
            },
            (newValue, oldValue, scope) => {
                if (newValue) {
                    thisComponent.refreshTextarea = false;
                    thisComponent.$interval(() => {
                        thisComponent.refreshTextarea = true;
                    }, 1, 1);
                }
            });

        this.registerSaveEvent();
    }

    protected onLoad() {
        const entry = this.getMySingleEntry(Models.Worksheet.WsEntryTypeEnum.text);
        if (entry && this.textEntryId !== entry.id) {
            this.textEntryId = entry.id;
            this.textEntry = entry.jsonData.text;
        }
        this.entries = this.getEntriesByAuthor(this.currentUser.id);
    }

    public refreshTextarea: boolean = true;

    // Settingsが設定されているかどうか
    public get isVisible(): boolean {
        return (
            // // ElementTypeがbasicか
            // this.element.property.elementTypeId === Anzas.Manacy.Models.Worksheet.WsElementTypeEnum.basic &&
            // // disableEntry = falseか
            // this.element.content.disableEntry === false &&

            // entrySettingsに設定が存在するか
            "text" in this.content.entrySettings ||
            "image" in this.content.entrySettings ||
            "video" in this.content.entrySettings ||
            "audio" in this.content.entrySettings ||
            "file" in this.content.entrySettings
        );
    }

    public get hasMedia(): boolean {
        return this.entries && this.entries.some((entry) => {
            return entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.image ||
                entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.video ||
                entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.audio ||
                entry.wsEntryTypeId === Models.Worksheet.WsEntryTypeEnum.file;
        });
    }

    private postEntry(wsEntryTypeId: Models.Worksheet.WsEntryTypeEnum, data: WsEntry.IData, textData: string) {
        this.wsAssignmentService.postEntry(this.element, {
            wsEntryTypeId,
            ownerUserId: this.ownerUserId as number,
            assignmentId: this.wsAssignmentService.assignment.id,
            jsonData: JSON.stringify(data),
            textData,
        }).then((entry) => {
            this.wsAssignmentService.reLoad(this.$scope);
        });
    }

    /**
     * アップロードのエントリを作成する。
     * @param wsEntryTypeId {Models.Worksheet.WsEntryTypeEnum}
     * @param uploadFileInfo {UploadServiceModels.IUploadFileInfo}
     */
    private postUploadEntry(wsEntryTypeId: Models.Worksheet.WsEntryTypeEnum, uploadFileInfo: UploadServiceModels.IUploadFileInfo) {
        const data: any = {
            file: {
                fileId: uploadFileInfo.uploadInfo.id,
                fileName: uploadFileInfo.fileInfo.file.name,
                size: uploadFileInfo.fileInfo.file.size,
                contentType: uploadFileInfo.fileInfo.file.type,
                uploadTime: uploadFileInfo.uploadTime,
            },
        };

        if (uploadFileInfo.fileInfo.data.duration) {
            data.file.duration = uploadFileInfo.fileInfo.data.duration;
        }

        if (uploadFileInfo.fileInfo.data.height) {
            data.file.height = uploadFileInfo.fileInfo.data.height;
        }

        if (uploadFileInfo.fileInfo.data.width) {
            data.file.width = uploadFileInfo.fileInfo.data.width;
        }

        this.postEntry(wsEntryTypeId, data, uploadFileInfo.fileInfo.file.name);
    }

    public onElementSave() {
        this.postEntry(Models.Worksheet.WsEntryTypeEnum.text, { text: this.textEntry }, this.textEntry);
    }

    public isValid(): boolean {
        return this.isRequired ? this.textEntry !== "" : true;
    }

    public isDirty(): boolean {
        const entry = this.getMySingleEntry(Models.Worksheet.WsEntryTypeEnum.text);
        return this.textEntry !== (entry ? entry.jsonData.text : "");
    }

    public openDrawing($event): void {
        const thisComponent = this;

        // parentElementパラメーターをダイアログに渡す
        const dialogOption = WsDrawingDialog.getDialogOptions($event);

        dialogOption.openFrom = $event.target;
        dialogOption.closeTo = $event.target;

        this.$mdDialog.show(dialogOption);

    }

    public onPictureUploadClick(files: File[]) {
        if (files) {
            files.forEach((file) => {
                // ファイルをアップロードする
                this.uploadService.upload(file, Models.Media.BlobTypeEnum.Images)
                    // Entryを作成する
                    .then((uploadFileInfo) => this.postUploadEntry(Models.Worksheet.WsEntryTypeEnum.image, uploadFileInfo));
            });
        }
    }

    public onVideoUploadClick(files: File[]) {
        this.uploadMedia(files, Models.Worksheet.WsEntryTypeEnum.video);
    }

    public onAudioUploadClick(files: File[]) {
        this.uploadMedia(files, Models.Worksheet.WsEntryTypeEnum.audio);
    }

    public uploadMedia(files: File[], entryType: Models.Worksheet.WsEntryTypeEnum) {
        if (files) {
            const blobType = entryType === Models.Worksheet.WsEntryTypeEnum.video ? Models.Media.BlobTypeEnum.Videos : Models.Media.BlobTypeEnum.Audio;

            files.forEach((file) => {
                // ファイルをアップロードする
                this.uploadService.upload(file, blobType)
                    // Entryを作成する
                    .then((uploadFileInfo) => this.postUploadEntry(entryType, uploadFileInfo));
            });
        }
    }

    public onFileUploadClick(files: File[]) {
        if (files) {
            files.forEach((file) => {
                // ファイルをアップロードする
                this.uploadService.upload(file, Models.Media.BlobTypeEnum.Files)
                    // Entryを作成する
                    .then((uploadFileInfo) => this.postUploadEntry(Models.Worksheet.WsEntryTypeEnum.file, uploadFileInfo));
            });
        }
    }

    public isTextEmpty(): boolean {
        if (this.textEntry === "" && this.hasMedia === undefined) {
            return true;
        } else {
            return false;
        }
    }
}
