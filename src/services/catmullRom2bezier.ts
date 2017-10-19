import { PointModel } from "../models/pointModel";

export function catmullRom2Bezier(pArr: PointModel[]) {
    const cubics = [];
    const iLen = pArr.length - 1;
    for (let i = 0; i < iLen; i++) {
        const p = [];
        if (0 === i) {
            p.push(pArr[i], pArr[i], pArr[i + 1], pArr[i + 2]);
        } else if (iLen - 1 === i) {
            p.push(pArr[i - 1], pArr[i], pArr[i + 1], pArr[i + 1]);
        } else {
            p.push(pArr[i - 1], pArr[i], pArr[i + 1], pArr[i + 2]);
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
