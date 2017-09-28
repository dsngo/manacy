import { PointModel } from "../models/pointModel";

export function catmullRom2bezier(points: PointModel[]) {
    const cubics = [];
    const iLen = points.length;
    for (let i = 0; i < iLen; i++) {
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
        const val = 6;
        cubics.push([
            (-p[0].x + val * p[1].x + p[2].x) / val,
            (-p[0].y + val * p[1].y + p[2].y) / val,
            (p[1].x + val * p[2].x - p[3].x) / val,
            (p[1].y + val * p[2].y - p[3].y) / val,
            p[2].x,
            p[2].y,
        ]);
    }
    return cubics;
}
