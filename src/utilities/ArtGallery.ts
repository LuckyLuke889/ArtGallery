export type Point = { x: number; y: number };
export type Triangle = [Point, Point, Point];

type Ear_Candidate = {
    point: Point;
    prev: Ear_Candidate;
    next: Ear_Candidate;
    reflex: boolean;
};

function isConvex(v: Ear_Candidate): boolean {
    const a = v.prev.point;
    const b = v.point;
    const c = v.next.point;

    const cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
    return cross < 0; 
}

function isPointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
    const area = (p1: Point, p2: Point, p3: Point) =>
        (p1.x * (p2.y - p3.y) +
         p2.x * (p3.y - p1.y) +
         p3.x * (p1.y - p2.y)) / 2;

    const total = Math.abs(area(a, b, c));
    const a1 = Math.abs(area(p, b, c));
    const a2 = Math.abs(area(p, c, a));
    const a3 = Math.abs(area(p, a, b));

    return Math.abs(total - (a1 + a2 + a3)) < 1e-10;
}

function containsNoPoints(v: Ear_Candidate, reflexVertices: Set<Ear_Candidate>): boolean {
    const a = v.prev.point;
    const b = v.point;
    const c = v.next.point;

    for (const u of reflexVertices) {
        if (u === v || u === v.prev || u === v.next) continue;
        if (isPointInTriangle(u.point, a, b, c)) return false;
    }
    return true;
}

function isEar(v: Ear_Candidate, reflexVertices: Set<Ear_Candidate>): boolean {
    return !v.reflex && containsNoPoints(v, reflexVertices);
}

function createVertexList(points: Point[]): Ear_Candidate[] {
    const vertices: Ear_Candidate[] = points.map(p => ({ point: p } as Partial<Ear_Candidate> as Ear_Candidate));
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
        vertices[i].prev = vertices[(i - 1 + n) % n];
        vertices[i].next = vertices[(i + 1) % n];
    }

    console.log(vertices);

    return vertices;
}

export function earClippingTriangulation(points: Point[]): Triangle[] {
    if (points.length < 3) throw new Error("Poligon mora imati barem 3 vrha.");

    let vertices = createVertexList(points);
    const reflexVertices = new Set<Ear_Candidate>();
    const convexVertices = new Set<Ear_Candidate>();
    const earVertices = new Set<Ear_Candidate>();
    const triangles: Triangle[] = [];

    for (const v of vertices) {
        v.reflex = !isConvex(v);
        if (v.reflex) reflexVertices.add(v);
        else convexVertices.add(v);
    }

    for (const v of convexVertices) {
        if (isEar(v, reflexVertices)) {
            earVertices.add(v);
        }
    }

    let n = vertices.length;
    while (n > 3) {
        let ear: Ear_Candidate | null = null;

        for (const candidate of earVertices) {
            ear = candidate;
            break;
        }

        if (!ear) throw new Error("Nije pronađeno nijedno uho. Poligon možda nije jednostavan.");

        const a = ear.prev;
        const b = ear;
        const c = ear.next;

        triangles.push([a.point, b.point, c.point]);

        a.next = c;
        c.prev = a;
        vertices = vertices.filter(v => v !== b);

        reflexVertices.delete(b);
        convexVertices.delete(b);
        earVertices.delete(b);

        for (const v of [a, c]) {
            const wasReflex = v.reflex;
            v.reflex = !isConvex(v);

            if (v.reflex) {
                reflexVertices.add(v);
                convexVertices.delete(v);
                earVertices.delete(v);
            } else {
                reflexVertices.delete(v);
                convexVertices.add(v);
                if (isEar(v, reflexVertices)) {
                    earVertices.add(v);
                } else {
                    earVertices.delete(v);
                }
            }
        }

        n--;
    }

    const [v1, v2, v3] = vertices;
    triangles.push([v1.point, v2.point, v3.point]);

    return triangles;
}
