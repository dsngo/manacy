import ComponentBase from "../componentBase";

export default class WsItemAnnotation extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = "appWsItemAnnotation";

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.template =
            `
<div layout="row" md-colors="{background: 'primary-50'}">
    <img src="../images/avatars/15.jpg" class="avatar" alt="who" style="" flex="none" />
    <div flex="grow">
        <p class="md-caption username">
            <span md-colors="{color: 'primary'}">本田 直也</span>&nbsp;
            <span>(2017/2/15 20:03)</span>
        </p>
        <p class="nomargin">
            「プレゼン課題1」、「プレゼン課題2」、「キャリアデザイン課題1」は、こちらから参照できます。 http://worksheet.jp/otemae/20161025/zw15002h.zip もし参照できなければ、el-Campusにログインして参照してください。
        </p>
    </div>
</div>
`;
        options.transclude = true;
    }

}
