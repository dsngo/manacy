/**
 * UUID version 4 (疑似乱数によるUUID)生成
 *
 * 擬似的な乱数による生成であるが、近年のJavascript実装であれば、実用上十分な一意性を保つことができる。
 * window.crypto.getRandomValuesが重い場合は、Math.random()にすれば乱数の品質は落ちるが高速化する。
 *
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * https://v8project.blogspot.jp/2015/12/theres-mathrandom-and-then-theres.html
 * https://ja.wikipedia.org/wiki/UUID#cite_note-1
 */
export default function uuidv4() {
    return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
        // tslint:disable-next-line:no-bitwise
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
    );
}
