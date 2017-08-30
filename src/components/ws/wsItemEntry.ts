import ComponentBase from '../componentBase';

export default class WsItemEntry extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = 'appWsItemEntry';

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.template =
            `
<div>
    <h3 class="md-title">プレゼンを聞いて質問をする</h2>
    <p class="md-body-1">１．発表者に対して、1つ以上の質問を考え、記述してください。（授業中に質問を行った方は、その内容をそのまま記載してもらって結構です）    </p>
    <app-ws-item-annotation></app-ws-item-annotation>
    <app-ws-item-discussion></app-ws-item-discussion>
    <!--<app-ws-item-single-entry></app-ws-item-single-entry>-->
    <app-ws-item-comment></app-ws-item-comment>
</div>
`;
        options.transclude = true;
    }

}