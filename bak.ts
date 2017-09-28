import { PointModel } from "./src/models/pointModel";

export function catmullRom2bezier(points: PointModel[]) {
    const cubics = [];
    const iLen = points.length;
    for (let i = 0; i < iLen; i++) {
        // const p = [];
        // if (0 === i) {
        //     p.push({ x: points[i].x, y: points[i].y });
        //     p.push({ x: points[i].x, y: points[i].y });
        //     p.push({ x: points[i + 1].x, y: points[i + 1].y });
        //     p.push({ x: points[i + 2].x, y: points[i + 2].y });
        // } else if (iLen - 4 === i) {
        //     p.push({ x: points[i - 1].x, y: points[i - 1].y });
        //     p.push({ x: points[i].x, y: points[i].y });
        //     p.push({ x: points[i + 1].x, y: points[i + 1].y });
        //     p.push({ x: points[i + 1].x, y: points[i + 1].y });
        // } else {
        //     p.push({ x: points[i - 1].x, y: points[i - 1].y });
        //     p.push({ x: points[i].x, y: points[i + 1].y });
        //     p.push({ x: points[i + 1].x, y: points[i + 1].y });
        //     p.push({ x: points[i + 2].x, y: points[i + 2].y });
        // }
        const p = [points[i - 1], points[i], points[i + 1], points[i + 2]];

        if (i === 0) {
            p[0] = {
                x: points[0].x,
                y: points[0].y,
            };
        }
        if (i === iLen - 2) {
            p[3] = {
                x: points[iLen - 2].x,
                y: points[iLen - 2].y,
            };
        }
        if (i === iLen - 1) {
            p[2] = {
                x: points[iLen - 1].x,
                y: points[iLen - 1].y,
            };
            p[3] = {
                x: points[iLen - 1].x,
                y: points[iLen - 1].y,
            };
        }
        console.log(`interation: ${i} - ${JSON.stringify(p)}`); // tslint:disable-line
        console.log(p.length); // tslint:disable-line
        // const val = 6;
        // cubics.push([
        //     (-p[0].x + val * p[1].x + p[2].x) / val,
        //     (-p[0].y + val * p[1].y + p[2].y) / val,
        //     (p[1].x + val * p[2].x - p[3].x) / val,
        //     (p[1].y + val * p[2].y - p[3].y) / val,
        //     p[2].x,
        //     p[2].y,
        // ]);
        cubics.push( { x: p[1].x,  y: p[1].y } );
        cubics.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
        cubics.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
        cubics.push( { x: p[2].x,  y: p[2].y } );
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
];
console.log(pointsA.length); // tslint:disable-line

const cubics1 = catmullRom2bezier(pointsA);
console.log("================="); // tslint:disable-line

console.log(cubics1); // tslint:disable-line
console.log("================="); // tslint:disable-line

console.log(cubics1.length); // tslint:disable-line
