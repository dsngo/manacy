import { PointModel } from "../models/pointModel";

export function catmullRom2Bezier(pArr: PointModel[]) {
    const cubics = [];
    const iLen = pArr.length - 1;
    for (let i = 0; i < iLen; i++) {
        const p = [pArr[i - 1], pArr[i], pArr[i + 1], pArr[i + 2]];
        if (i === 0) {
            p[0] = { x: pArr[0].x, y: pArr[0].y };
        }
        if (i === iLen - 2) {
            p[3] = { x: pArr[iLen - 2].x, y: pArr[iLen - 2].y };
        }
        if (i === iLen - 1) {
            p[2] = { x: pArr[iLen - 1].x, y: pArr[iLen - 1].y };
            p[3] = { x: pArr[iLen - 1].x, y: pArr[iLen - 1].y };
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
