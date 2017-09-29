import { PointModel } from "../Models/pointModel";

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(point: PointModel, nextPont: PointModel) {
    const dx = point.x - nextPont.x;
    const dy = point.y - nextPont.y;
    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(point: PointModel, pointOne: PointModel, pointTwo: PointModel) {
    let x = pointOne.x;
    let y = pointOne.y;
    let dx = pointTwo.x - x;
    let dy = pointTwo.y - y;
    if (dx !== 0 || dy !== 0) {
        const t = ((point.x - x) * dx + (point.y - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            x = pointTwo.x;
            y = pointTwo.y;
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }
    dx = point.x - x;
    dy = point.y - y;
    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points: PointModel[], sqTolerance) {
    let point;
    let prevPoint = points[0];
    const newPoints = [prevPoint];
    const len = points.length;
    for (let i = 1; i < len; i++) {
        point = points[i];
        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }
    if (prevPoint !== point) {
        newPoints.push(point);
    }
    return newPoints;
}

function simplifyDPStep(points: PointModel[], first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance;
    let index;
    for (let i = first + 1; i < last; i++) {
        const sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }
    if (maxSqDist > sqTolerance) {
        if (index - first > 1) {
            simplifyDPStep(points, first, index, sqTolerance, simplified);
        }
        simplified.push(points[index]);
        if (last - index > 1) {
            simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points: PointModel[], sqTolerance) {
    const last = points.length - 1;
    const simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);
    return simplified;
}

// both algorithms combined for awesome performance
export function simplify(points: PointModel[], tolerance, highestQuality) {
    if (points.length <= 2) {
        return points;
    }
    const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);
    return points;
}
