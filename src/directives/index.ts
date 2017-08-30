import Recurse from "./recurse/recurse";
import RecurseNode from "./recurse/recurseNode";
import VgCustomize from "./videogular/vgCustomize";
import VgPlay from "./videogular/vgPlay";
import Body from "./body";

export default function registerDirectives(app: ng.IModule) {
    // 再帰ディレクティブ
    Recurse.register(app);
    RecurseNode.register(app);

    // videogular拡張ディレクティブ
    VgCustomize.register(app);
    VgPlay.register(app);

    // Bodyタグ拡張ディレクティブ
    Body.register(app);
}
