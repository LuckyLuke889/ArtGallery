import { Triangle } from "./ArtGallery";

type Color = 1 | 2 | 3;  

type Graph = Map<Point, Point[]>;  

type Point = { x: number; y: number };  


function isValidColor(vertex: Point, graph: Graph, colors: Map<Point, Color>, color: Color): boolean {
    const adjacentVertices = graph.get(vertex) || [];
    for (const adjacent of adjacentVertices) {
        if (colors.get(adjacent) === color) {
            return false;
        }
    }
    return true;
}

function graphColoring(graph: Graph, vertices: Point[], colors: Map<Point, Color>, index: number): boolean {
    if (index === vertices.length) {
        return true;  
    }

    const vertex = vertices[index];

    for (const color of [1, 2, 3] as Color[]) {
        if (isValidColor(vertex, graph, colors, color)) {
            colors.set(vertex, color);  

            if (graphColoring(graph, vertices, colors, index + 1)) {
                return true; 
            }

            colors.delete(vertex); 
        }
    }

    return false;  
}


function buildGraphFromTriangles(triangles: Triangle[]): Graph {
    const graph: Graph = new Map();

    for (const [a, b, c] of triangles) {
        if (!graph.has(a)) graph.set(a, []);
        if (!graph.has(b)) graph.set(b, []);
        if (!graph.has(c)) graph.set(c, []);

        graph.get(a)!.push(b, c);
        graph.get(b)!.push(a, c);
        graph.get(c)!.push(a, b);
    }

    for (const [key, value] of graph) {
        graph.set(key, Array.from(new Set(value)));
    }

    return graph;
}


export function threeColorPolygon(triangles: Triangle[]): Map<Point, Color> {
    const graph = buildGraphFromTriangles(triangles);

    const vertices = Array.from(graph.keys());
    const colors: Map<Point, Color> = new Map();

    if (!graphColoring(graph, vertices, colors, 0)) {
        throw new Error("Graph cannot be colored with 3 colors.");
    }

    return colors;
}
