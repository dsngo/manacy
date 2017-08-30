import ComponentBase from '../componentBase';

export default class WsItemComment extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = 'appWsItemComment';

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.template =
            `
<div layout="row">
    <img src="../images/avatars/15.jpg" class="avatar" alt="who" style="" flex="none" />
    <div flex="grow">
        <p class="md-caption username">
            <span md-colors="{color: 'primary'}">本田 直也</span>&nbsp;
            <span>(2017/2/15 20:03)</span>
        </p>
        <p class="nomargin">
            声の速さや大きさが丁度よく、聞き取りやすかった。また、重要な言葉には色を付けるなどの工夫がされていた。
        </p>
    </div>
</div>

<div layout="row">
    <img src="../images/avatars/default.jpg" class="avatar" alt="who" style="" flex="none" />
    <div flex="grow">
        <p class="md-caption username">
            <span md-colors="{color: 'primary'}">早川 楽</span>&nbsp;
        </p>
        <md-input-container class="md-block nomargin">
            <label>コメントを記入</label>
            <textarea name="text" ng-model="$ctrl.data.text" ngRequired="true" md-select-on-focus md-resize-textarea rows="2"></textarea>
        </md-input-container>
        <div layout="row" layout-align="end center">
            <div ng-click="$ctrl.onSaveClick()" >
                <!-- md-buttonのバグでng-clickが動かないため代替手段 -->
                <md-button class="md-primary" ng-disabled="$ctrl.entryForm.$pristine">                <md-icon>question_answer</md-icon>
コメントを保存</md-button>
            </div>
        </div>
    </div>
</div>
`;
        options.transclude = true;
    }
}