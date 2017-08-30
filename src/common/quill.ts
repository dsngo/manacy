/**
 * ng-quillの初期設定
 * @param app
 */

// import * as Quill from "quill";
// import { ImageResize } from "quill-image-resize-module";
// 上記のimportが実行時エラーになってうまく動作しないため、windowオブジェクトから直接es6 moduleを引っ張ってくる
const Quill = window["Quill"];                      // import
const ImageResize = window["ImageResize"].default;  // import

export default function registerQuill(app: ng.IModule) {
    // Register Quill Modules
    Quill.register("modules/imageResize", ImageResize);     // Image Resize Module

    // ngQuillのデフォルト設定
    app.config(["ngQuillConfigProvider", (ngQuillConfigProvider) => {

        const config: Quill.QuillOptionsStatic = {
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike"],        // toggled buttons
                    ["blockquote", "code-block"],

                    // [{ header: 1 }, { header: 2 }],               // custom button values
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],      // superscript/subscript
                    [{ indent: "-1" }, { indent: "+1" }],          // outdent/indent
                    [{ direction: "rtl" }],                         // text direction

                    [{ size: ["small", false, "large", "huge"] }],  // custom dropdown
                    // [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
                    // [{ 'font': [] }],
                    [{ align: [] }],

                    ["clean"],                                         // remove formatting button

                    ["link", "image", "video"],                         // link and image, video
                ],
                imageResize: {},
            },
            theme: "snow",
            placeholder: "ここに説明を記入します...",
            readOnly: false,
        };

        ngQuillConfigProvider.set(config);

    }]);
}
