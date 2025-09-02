import * as ArtGallery from "../utilities/ArtGallery";
import { solveArtGalleryProblemOptimized } from '../utilities/PolygonVisibility';


export const sendData = (points:number[]) => {
    let pointsRearrangged:ArtGallery.Point[] = [];

    for(let i = 0; i < points.length - 2; i += 2){
      const pair:ArtGallery.Point = {x:points[i], y:points[i+1]};
      pointsRearrangged.push(pair);
    }

    console.log("pointsRearrangged", pointsRearrangged);

    const polygon: ArtGallery.Point[] = pointsRearrangged;
  
    const triangles = ArtGallery.earClippingTriangulation(polygon);
    const solution = solveArtGalleryProblemOptimized(polygon);
    console.log("Triangulated triangles:", triangles);
    console.log("Solution:",solution)

    return [triangles, solution];
}