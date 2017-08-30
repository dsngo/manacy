import ComponentBase from '../componentBase';

export default class WsItemSingleEntry extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = 'appWsItemSingleEntry';

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.template =
            `
<md-card>
<div layout="row">
    <img src="../images/avatars/5.jpg" class="avatar" alt="who" style="" flex="none" />
    <div flex="grow">
        <p class="md-caption username">
            <span md-colors="{color: 'primary'}">江口香織</span>&nbsp;
        </p>
        <p class="md-body-1 notopmargin">
        早口になることもなく、聞きやすい声でスライドも自分の表現したいことがこちらにも伝わってくるような出来だった。
        </p>
    </div>
</div>
</md-card>

<md-card>
<div layout="row">
    <img src="../images/avatars/default.jpg" class="avatar" alt="who" style="" flex="none" />
    <div flex="grow">
        <p class="md-caption username">
            <span md-colors="{color: 'primary'}">早川 楽</span>&nbsp;
        </p>
        <md-input-container class="md-block">
            <label>記入欄</label>
            <textarea name="text" ng-model="$ctrl.data.text" ngRequired="true" md-maxlength="200" md-select-on-focus md-resize-textarea rows="3"></textarea>
        </md-input-container>
        <div layout="row" layout-align="end center">
            <md-button>
                <md-icon>keyboard_voice</md-icon>
            </md-button>
            <md-button>
                <md-icon>movie</md-icon>
            </md-button>
            <md-button>
                <md-icon>attach_file</md-icon>
            </md-button>
            <div >
                <input class="ng-hide" id="input-file-id" multiple type="file" ngf-select="$ctrl.onPictureUploadClick($files)" accept="image/*" ngf-capture="camera" ngf-max-size="20MB" ngf-multiple="true" ngf-fix-orientation="true" />
                <label for="input-file-id" class="md-button" style="z-index:10" md-ink-ripple="true">
                    <md-icon style="z-index:-1">photo_camera</md-icon>
                </label>
            </div>
            <div ng-click="$ctrl.onSaveClick()" >
                <!-- md-buttonのバグでng-clickが動かないため代替手段 -->
                <md-button class="md-raised md-primary" ng-disabled="$ctrl.entryForm.$pristine">保存</md-button>
            </div>
        </div>

        <md-grid-list md-cols-xs="2" md-cols="4" md-row-height="8:3" md-gutter="2px">
            <md-grid-tile class="image" md-colspan="2" md-rowspan="3" style="background-image: url(../uploaded/24612102723338260.jpg);"></md-grid-tile>
            <md-grid-tile md-colspan="2" md-rowspan="1">
                <md-icon>description</md-icon>
                <h3>プレゼンテーション.pptx</h3>
            </md-grid-tile>
            <md-grid-tile class="image" md-colspan="2" md-rowspan="3" style="background-image: url(../uploaded/24612102723338261.jpg);"></md-grid-tile>
            <md-grid-tile class="image" md-colspan="2" md-rowspan="7" style="background-image: url(../uploaded/24612102723338262.jpg);"></md-grid-tile>
            <md-grid-tile class="image" md-colspan="1" md-rowspan="3" style="background-image: url(../uploaded/24612102723338263.jpg);"></md-grid-tile>
        </md-grid-list>
        
    </div>
</div>
</md-card>

`;
        options.transclude = true;
    }

}