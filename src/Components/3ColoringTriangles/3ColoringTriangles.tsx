import { Stage, Layer, Line, Circle } from "react-konva";
import { useLocation } from 'react-router-dom';
import { threeColorPolygon } from '../../utilities/ThreeColoring';
import { useNavigate } from "react-router-dom";
import GradientButton from "../GradientButton/GradientButton";
import '../../App.css'


export const ThreeColoringTriangles = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const triangles = location.state?.triangles || []; 
    const polygon = location.state?.polygon || []; 
    const colors = threeColorPolygon(triangles);
    const solution = location.state?.solution || []; 
    

    return (
       <>
        <div className="background">
        <div style={{ position: "relative", height: "90vh", width: "90wh" }}>
            <div style={{ height: "100%", width: "100%" }}>
                <Stage width={1500} height={700}>
                    <Layer>
                        {triangles.map((triangle: any[], triangleIndex: number) => {
                            const coordinates: number[] = triangle.flatMap(({ x, y }) => [x, y]);

                            return (
                                <Line
                                    key={`triangle-${triangleIndex}`} 
                                    closed
                                    points={coordinates}
                                    fill="gray"
                                    stroke="black"
                                    strokeWidth={1}
                                />
                            );
                        })}
                        {triangles.flat().map((point:any, index:any) => {
                            const color = colors.get(point) || 1;
                            const fillColor = color === 1 ? "red" : color === 2 ? "green" : "blue";

                            return (
                                <Circle
                                    key={`circle-${index}`}
                                    x={point.x}
                                    y={point.y}
                                    radius={5}
                                    fill={fillColor}
                                />
                            );
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
        <div className="btn-container">
          <GradientButton points={triangles} text="Get solution" action={() => {
                    
                if(triangles && polygon){
                    navigate("/solution", { state: { triangles, polygon, solution } });
                }
          
                }}></GradientButton>
        </div>
       </div>
      </>
    );
};
