import { Point, earClippingTriangulation } from "./ArtGallery";
import { threeColorPolygon } from "./ThreeColoring";


function isPointVisible(guard: Point, target: Point, polygon: Point[]): boolean {
    const direction = { x: target.x - guard.x, y: target.y - guard.y };

    for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % polygon.length];

        if (segmentsIntersect(guard, target, a, b)) {
            return false;
        }
    }
    return true;
}


function segmentsIntersect(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
    const orientation = (p: Point, q: Point, r: Point) =>
        (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    const o1 = orientation(p1, p2, q1);
    const o2 = orientation(p1, p2, q2);
    const o3 = orientation(q1, q2, p1);
    const o4 = orientation(q1, q2, p2);

    if (o1 !== o2 && o3 !== o4) return true;

    return false; 
}

function placeGuardsWithTriangulation(polygon: Point[]): { guards: Point[], visibility: Map<Point, Point[]> } {

    const triangles = earClippingTriangulation(polygon);

    const colors = threeColorPolygon(triangles);

    const colorCounts = new Map<number, Point[]>();

    for (const [vertex, color] of colors.entries()) {
        if (!colorCounts.has(color)) {
            colorCounts.set(color, []);
        }
        colorCounts.get(color)!.push(vertex);
    }

    const leastUsedColor = Array.from(colorCounts.entries()).sort((a, b) => a[1].length - b[1].length)[0][0];
    const guards = colorCounts.get(leastUsedColor) || [];

    // Izračun vidljivosti za svaki čuvar
    const visibility: Map<Point, Point[]> = new Map();

    for (const guard of guards) {
        const visiblePoints: Point[] = [];

        for (const target of polygon) {
            if (isPointVisible(guard, target, polygon)) {
                visiblePoints.push(target);
            }
        }

        visibility.set(guard, visiblePoints);
    }

    return { guards, visibility };
}

export function solveArtGalleryProblemOptimized(polygon: Point[]): { guards: Point[], visibility: Map<Point, Point[]> } {
    const { guards, visibility } = placeGuardsWithTriangulation(polygon);

    return { guards, visibility };
}
