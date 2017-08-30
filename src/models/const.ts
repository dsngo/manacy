export default class Const {

    public static readonly MAX_LEN_NAME: number = 256;

    // Emailフィールドの長さ
    public static readonly MAX_LEN_EMAIL: number = 256;

    // nvarcharフィールドの最大長さ指定
    // （1～4000もしくはmax = 2GB）
    public static readonly MAX_LEN_NVARCHAR: number = 4000;

    // varcharフィールドの最大長さ指定
    // （1～8000もしくはmax = 2GB）
    public static readonly MAX_LEN_VARCHAR: number = 8000;

    // 項目ツリーの最大階層数
    // （1階層あたり12バイト使用。他のインデックスも含め、SQL Serverの最大インデックス長900バイト以下にすること）
    public static readonly MAX_ITEM_TREE_DEPTH: number = 30;

    // DateTime最大値（文字列）を定義
    // .NET / SQL Server / Javascript で扱える十分に大きな日付
    public static readonly MAX_DATE_STR: string = "9999-12-31 23:59:59";

    // DateTime最大値を定義
    // .NET / SQL Server / Javascript で扱える十分に大きな日付
    public static MAX_DATE: Date = new Date(Const.MAX_DATE_STR);

    // DateTime最小値（文字列）を定義
    // .NET / SQL Server / Javascript で扱える十分に小さな日付
    public static readonly MIN_DATE_STR: string = "1970-01-01 00:00:00";

    // DateTime最小値を定義
    // .NET / SQL Server / Javascript で扱える十分に小さな日付
    public static MIN_DATE: Date = new Date(Const.MIN_DATE_STR);

    // Order値を追加する場合の初期幅
    public static readonly ORDER_SEED: number = 100;

}
