import { Stage, Layer, Line, Circle } from "react-konva";
import { useLocation } from 'react-router-dom';
import { threeColorPolygon } from '../../utilities/ThreeColoring';
import GradientButton from "../GradientButton/GradientButton";
import { useNavigate } from "react-router-dom";
import '../../App.css'



export const Triangles = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const triangles = location.state?.triangles || []; 
    const solution = location.state?.solution || []; 
    const polygon = location.state?.polygon || []; 
    const colors = threeColorPolygon(triangles);
    console.log("colors", colors);
    console.log(solution)

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
                    </Layer>
                </Stage>
            </div>
        </div>
        <div className="btn-container">
          <GradientButton points={triangles} text="Apply 3-coloring" action={() => {
                    
                if(triangles && polygon){
                    navigate("/3coloring", { state: { triangles, polygon, solution } });
                }
          
                }}></GradientButton>
        </div>
      </div>
    </>
    );
};
