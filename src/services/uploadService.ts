import * as restangular from "restangular";
import Models from "../models/models";
import ServiceBase from "./serviceBase";

// tslint:disable-next-line:no-namespace
declare global {
    namespace UploadServiceModels {
        interface IUploadFileInfo {
            uploadInfo: IUploadInfo;
            fileInfo: IFileInfo;
            uploadTime: number;
        }

        interface IUploadInfo {
            id: string;
            url: string;
        }

        interface IFileInfo {
            file: File;
            type: Models.Media.BlobTypeEnum;
            data: IFileInfoOtherData;
        }

        interface IFileInfoOtherData {
            width?: number;
            height?: number;
            duration?: number;
        }
    }
}
/**
 * ng-file-uploadの@typingsファイルが古いまま更新されていないため、手動で新しいメソッド宣言を追加
 */
declare module "angular" {
    export namespace angularFileUpload {
        interface IUploadService {
            mediaDuration(file: File): angular.IPromise<number>;
        }
    }
}

export default class UploadService extends ServiceBase {
    /**
     * 登録サービス名
     */
    public static readonly IID = "uploadService";

    /**
     * インジェクトするサービス
     */
    private static $inject = ["Restangular", "$q", "Upload", "$mdToast"];

    /**
     * コンストラクタ
     */
    public constructor(
        protected Restangular: restangular.IService,
        protected $q: ng.IQService,
        protected Upload: ng.angularFileUpload.IUploadService,
        protected $mdToast: ng.material.IToastService,
    ) {
        super();
    }

    public getImageDimensions(file) {
        this.busy(true);
        return this.Upload.imageDimensions(file).finally(() => {
            this.busy(false);
        });
    }

    public getMediaDuration(file) {
        this.busy(true);
        return this.Upload.mediaDuration(file).finally(() => {
            this.busy(false);
        });

    }

    public upload(file: File, blobType: Models.Media.BlobTypeEnum): ng.IPromise<UploadServiceModels.IUploadFileInfo> {
        let startTime;

        this.busy(true);
        return this.getFileInfo(file, blobType)
            // アップロード開始を通知
            .then((fileInfo) => this.noticeUploadStart(fileInfo).then((uploadInfo) => Object({fileInfo, uploadInfo})))
            // 開始時刻をセット
            .then((uploadFileInfo) => {
                startTime = Date.now();
                return uploadFileInfo;
            })
            // アップロード
            .then((uploadFileInfo) => this.uploadFile(uploadFileInfo).then(() => uploadFileInfo))
            // アップロード終了を通知
            .then((uploadFileInfo) => this.noticeUploadEnd(uploadFileInfo).then(() => uploadFileInfo))
            // アップロードで経過した時間をセット
            .then((uploadFileInfo) => {
                uploadFileInfo.uploadTime = Date.now() - startTime;
                return uploadFileInfo;
            })
            .finally(() => this.busy(false));
    }

    private getFileInfo(file: File, type: Models.Media.BlobTypeEnum): ng.IPromise<UploadServiceModels.IFileInfo> {
        if (type === Models.Media.BlobTypeEnum.Images) {
            this.busy(true);
            return this.getImageDimensions(file)
                .then((dimensions) => Object({file, type, data: dimensions}))
                .finally(() => this.busy(false));
        }

        if (type === Models.Media.BlobTypeEnum.Videos || type === Models.Media.BlobTypeEnum.Audio) {
            this.busy(true);
            return this.getMediaDuration(file)
                .then((duration) => Object({file, type, data: {duration}}))
                .finally(() => this.busy(false));
        }

        return this.$q.resolve({file, type, data: {}});
    }

    /**
     * アップロードを始めることを通知する。
     * @param fileInfo {UploadServiceModels.IFileInfo}
     * @return {IPromise<UploadServiceModels.IUploadInfo>}
     */
    private noticeUploadStart(fileInfo: UploadServiceModels.IFileInfo): ng.IPromise<UploadServiceModels.IUploadInfo> {
        const req = {
            blobType: fileInfo.type,
            duration: fileInfo.data.duration,
            fileName: fileInfo.file.name,
            height: fileInfo.data.height,
            size: fileInfo.file.size,
            width: fileInfo.data.width,
        };

        this.busy(true);
        return this.Restangular.one("media")
            .customPOST(req, "upload")
            .then((res: Models.Dtos.BlobUploadResponseDto) => Object({id: res.uploadBlobId, url: res.uploadURL}))
            .finally(() => this.busy(false));
    }

    /**
     * ストレージにファイルをアップロードする。
     * @param uploadFileInfo {UploadServiceModels.IUploadFileInfo}
     * @return {IPromise<void>}
     */
    private uploadFile(uploadFileInfo: UploadServiceModels.IUploadFileInfo): ng.IPromise<void> {
        this.busy(true);
        return this.Upload
            .http({
                url: uploadFileInfo.uploadInfo.url,
                data: uploadFileInfo.fileInfo.file,
                method: "PUT",
                headers: {
                    "x-ms-blob-type": "BlockBlob",
                    "x-ms-blob-content-type": uploadFileInfo.fileInfo.file.type,
                },
            })
            .then(() => void 0)
            .catch((reason) => {
                this.$mdToast.showSimple(`ファイルのアップロードに失敗しました。もう一度試して下さい。(${uploadFileInfo.fileInfo.file.name})`);
                return reason;
            })
            .finally(() => this.busy(false));
    }

    /**
     * アップロードが完了したことをAPIに通知する。
     * @param uploadFileInfo {UploadServiceModels.IUploadFileInfo}
     * @return {IPromise<void>}
     */
    private noticeUploadEnd(uploadFileInfo: UploadServiceModels.IUploadFileInfo): ng.IPromise<void> {
        this.busy(true);
        return this.Restangular.one("media")
            .customPUT({uploadBlobId: uploadFileInfo.uploadInfo.id}, "uploadcompleted")
            .then(() => void 0)
            .finally(() => this.busy(false));
    }

    /**
     * 個人情報設定画面アバターの画像アップロード処理
     * @param file アップロードする画像
     */
    public uploadAvatar(file: File): ng.IPromise<UploadServiceModels.IUploadInfo> {
        this.busy(true);

        // TODO api/test/uploadを暫定的に使用しているため2017/09以降に対応必要
        return this.Restangular.one("test", "upload").get().then((info) => {

            return this.Upload.http({
                url: info.url,
                data: file,
                method: "PUT",
                headers: {
                    "x-ms-blob-type": "BlockBlob",
                    "x-ms-blob-content-type": file.type,
                },
            }).then(() => {
                return info;
            }, (reason) => {
                this.$mdToast.showSimple("ファイルのアップロードに失敗しました。もう一度試して下さい。(" + file.name + ")");
                return reason;
            });

        }).finally(() => {
            this.busy(false);
        });

    }
}
