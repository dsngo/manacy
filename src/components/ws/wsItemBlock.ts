import ComponentBase from '../componentBase';

export default class WsItemBlock extends ComponentBase {
    /**
     * 登録コンポーネント名
     */
    public static readonly IID: string = 'appWsItemBlock';

    /**
     * コンポーネントオプション
     */
    protected static setOptions(options: ng.IComponentOptions) {
        super.setOptions(options);
        options.template =
            `
<div>
    <h2 class="md-headline">プレゼンテーションに対するピアレビュー</h2>
    <p class="md-body-1">※本課題は12月6日から複数週にわたって取り組みます。発表者1人ごとに、下記の指示に従って書き込み、保存を行います。発表人数分（クラス人数分）の書き込み、保存を終えたらようやく完了となります。<br> ※授業を欠席した人も、大きな遅刻をした人も、課題内容は同じです。発表資料をもとに発表内容を推測し、同じ課題指示内容に従って取り組んでください。
    </p>
    <ng-transclude></ng-transclude>
</div>
`;
        options.transclude = true;
    }

}