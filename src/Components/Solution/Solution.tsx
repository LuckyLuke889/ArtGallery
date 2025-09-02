import { Stage, Layer, Line, Image } from "react-konva";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../../App.css"

export const Solution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const triangles = location.state?.triangles || []; 
  const solution = location.state?.solution || { guards: [] }; 

  const [cameraImage, setCameraImage] = useState<HTMLImageElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const img = new window.Image();
    img.src = "securitycam3.jpg"; 
    img.onload = () => {
      setCameraImage(img);
    };
  }, []);

  const downloadPDF = async () => {
    if (!stageRef.current) return;

    try {
      const canvas = await html2canvas(stageRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");

      console.log("imgData", typeof(imgData));

      // Prilagođavanje dimenzija PDF-a
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const title = "Art Gallery Problem Solution";
      const titleWidth = pdf.getTextWidth(title);
      const titleX = (pdfWidth - titleWidth) / 2; 
  
      pdf.setFontSize(16); 
      pdf.text(title, titleX, 10); 
  
      const camerasText = `Number of cameras needed: ${solution.guards.length}`;
      const camerasTextWidth = pdf.getTextWidth(camerasText); 
      const camerasTextX = (pdfWidth - camerasTextWidth) / 2; 
  
      pdf.setFontSize(12); 
      pdf.text(camerasText, camerasTextX, 20); 
  
      const marginTop = 20;
      pdf.addImage(imgData, "PNG", 10, marginTop, pdfWidth, pdfHeight - marginTop);
      pdf.save("gallery-solution.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <div className="background">
        <div className="textbox">
          <h2>You need {solution.guards.length} cameras to cover your gallery!</h2>
          <button className="btn"
            onClick={downloadPDF}
          >
            Download as PDF
          </button>
          <button className="btn" onClick={()=>{navigate("/")}}>Return</button>
        </div>
      <div style={{ position: "relative", height: "90vh", width: "90vw" }}>
        <div ref={stageRef} style={{ height: "100%", width: "100%" }}>
          <Stage width={1500} height={700}>
            <Layer>
              {/* Iscrtavanje trokuta */}
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

              {/* Iscrtavanje vrhova */}
              {triangles.flat().map((point: any, index: number) => {
                // Proveri da li je tačka čuvar (guard)
                const isGuard = solution.guards.some(
                  (guard: any) => guard.x === point.x && guard.y === point.y
                );

                if (isGuard && cameraImage)
                  return (
                    <Image
                      key={`camera-icon-${index}`}
                      x={point.x - 15}
                      y={point.y - 15} 
                      image={cameraImage}
                      width={30} 
                      height={30}
                    />
                  );
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
    </>
    
  );
};
