import { PointModel } from "./src/models/pointModel";

export function catmullRom2Bezier(points: PointModel[]) {
    const cubics = [];
    const iLen = points.length - 1;
    for (let i = 0; i < iLen; i++) {
        const p = [];
        if (0 === i) {
            p.push(points[i], points[i], points[i + 1], points[i + 2]);
        } else if (iLen - 1 === i) {
            p.push(points[i - 1], points[i], points[i + 1], points[i + 1]);
        } else {
            p.push(points[i - 1], points[i], points[i + 1], points[i + 2]);
        }
        cubics.push([
            (-p[0].x + 6 * p[1].x + p[2].x) / 6,
            (-p[0].y + 6 * p[1].y + p[2].y) / 6,
            (p[1].x + 6 * p[2].x - p[3].x) / 6,
            (p[1].y + 6 * p[2].y - p[3].y) / 6,
            p[2].x,
            p[2].y,
        ]);
    }
    return cubics;
}

const pointsA = [
    { x: 1, y: 5 },
    { x: 6, y: 3 },
    { x: 2, y: 9 },
    { x: 1, y: 4 },
    { x: 4, y: 123 },
    { x: 561, y: 153 },
    { x: 44, y: 123 },
    { x: 445, y: 223 },
    { x: 245, y: 283 },
    { x: 545, y: 483 },
];
console.log(pointsA.length); // tslint:disable-line

const cubics1 = catmullRom2Bezier(pointsA);
console.log("================="); // tslint:disable-line

console.log(cubics1); // tslint:disable-line
console.log("================="); // tslint:disable-line
function createD(points: PointModel[]) {
    const cubics = catmullRom2Bezier(points);
    const cLen = cubics.length;
    let attribute = `M${points[0].x},${points[0].y} `;
    cubics.forEach(e => (attribute += `C${e[0]},${e[1]},${e[2]},${e[3]},${e[4]},${e[5]} `));
    // for (let i = 0; i < cLen; i++) {
    //     attribute += `C${cubics[i][0].x},${cubics[i][0].y},${cubics[i][1].x},${cubics[i][1].y},${cubics[i][2].x},${cubics[i][2].y} `;
    // }
    return attribute;
}
const a = createD(pointsA);
console.log(a); // tslint:disable-line
console.log(cubics1.length); // tslint:disable-line
