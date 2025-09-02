import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Transformer, Line } from "react-konva";
import { DrawAction } from "../../constants";
import { getNumericVal, getRelativePointerPosition } from "../../utilities";
import { v4 as uuidv4 } from "uuid";
import { Stage as StageType } from "konva/lib/Stage";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import GradientButton from "../GradientButton/GradientButton";
import "../../App.css"
import {
  STROKE_COLOR,
  MULTI_POINT_LINE_BG,
} from "../../constants";
import MultiPointLine from "../MultiPointLine/MultiPointLine";
import { LineConfig } from "konva/lib/shapes/Line";
import { useNavigate } from "react-router-dom";
import { sendData } from "../../utilities/sendData";

interface DrawProps {}

export const Draw: React.FC<DrawProps> = React.memo(function Draw({}) {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<StageType | null>(null);

  const transformerRef = useRef<TransformerType>(null);

  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.MultiPointLine);

  const [isDraggable, setIsDraggable] = useState(false);

  const [currentlyDrawnShape, setCurrentlyDrawnShape] = useState<NodeConfig>();
  const [drawings, setDrawings] = useState<NodeConfig[]>([]);

  const isPaintRef = useRef(false);
  const numMultiPointRef = useRef(0);

  const [{ viewWidth, viewHeight }, setViewMeasures] = useState<{
    viewHeight: number | undefined;
    viewWidth: number | undefined;
  }>({
    viewHeight: undefined,
    viewWidth: undefined,
  });

  useEffect(() => {
    if (containerRef.current) {
      setViewMeasures({
        viewHeight: containerRef.current.offsetHeight,
        viewWidth: containerRef.current.offsetWidth,
      });
    }
  }, [containerRef]);

  const onStageMouseUp = () => {
    if (numMultiPointRef.current) return;

    isPaintRef.current = false;

    if (currentlyDrawnShape)
      setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
    setCurrentlyDrawnShape(undefined);
  };

  const [currentSelectedShape, setCurrentSelectedShape] = useState<{
    node: Node<NodeConfig>;
    attrs?: NodeConfig;
  }>();

  const deSelect = useCallback(() => {
    transformerRef?.current?.nodes([]);
    setIsDraggable(false);
    setCurrentSelectedShape(undefined);
  }, []);

  const checkDeselect = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === stageRef?.current;
      if (clickedOnEmpty) {
        deSelect();
      }
    },
    [stageRef, deSelect]
  );

  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    checkDeselect(e);
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage) return;
    const id = uuidv4();

    const pos = getRelativePointerPosition(stage);
    const x = getNumericVal(pos?.x);
    const y = getNumericVal(pos?.y);

    if (drawAction === DrawAction.MultiPointLine) {
      if (numMultiPointRef.current === 0) {
        setCurrentlyDrawnShape({
          id,
          points: [x, y],
          name: DrawAction.MultiPointLine,
          stroke: STROKE_COLOR,
          fill: MULTI_POINT_LINE_BG,
        });
        console.log("x:",x,"y:",y)
      } else {
        if (
          numMultiPointRef.current >= 3 &&
          currentlyDrawnShape?.points?.[0] ===
            currentlyDrawnShape?.points?.at(-2) &&
          currentlyDrawnShape?.points?.[1] ===
            currentlyDrawnShape?.points?.at(-1)
        ) {
          if (currentlyDrawnShape)
            setDrawings((prevDrawings) => [
              ...prevDrawings,
              currentlyDrawnShape,
            ]);
          setCurrentlyDrawnShape(undefined);
          numMultiPointRef.current = 0;
        }
        setCurrentlyDrawnShape((prevLine: LineConfig) => ({
          ...prevLine,
          points: [...(prevLine?.points || []), x, y],
        }));
      }
      numMultiPointRef.current += 1;
      return;
    }

    isPaintRef.current = true;
  };

  const onStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage) return;

    const pos = getRelativePointerPosition(stage);
    const x = getNumericVal(pos?.x);
    const y = getNumericVal(pos?.y);

    if (numMultiPointRef.current && drawAction === DrawAction.MultiPointLine) {
      setCurrentlyDrawnShape((prevLine: LineConfig) => {
        const prevPoints = [...(prevLine?.points || [])];
        const pointsLength = numMultiPointRef.current;

        if (
          Math.abs(prevPoints?.[0] - x) < 7 &&
          Math.abs(prevPoints?.[1] - y) < 7
        ) {
          prevPoints[pointsLength * 2] = prevPoints?.[0];
          prevPoints[pointsLength * 2 + 1] = prevPoints?.[1];
        } else {
          prevPoints[pointsLength * 2] = x;
          prevPoints[pointsLength * 2 + 1] = y;
        }

        return { ...prevLine, points: prevPoints };
      });

      return;
    }

    if (!isPaintRef.current) return;
  };

  const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
    if (drawAction !== DrawAction.Select) return;
    const node = e.currentTarget;
    setCurrentSelectedShape({ node, attrs: node.attrs });

    setIsDraggable(true);
    transformerRef.current?.nodes([node]);
  };

  const shapeProps = {
    onClick: onShapeClick,
    draggable: isDraggable,
  };

  console.log({ drawings });

  return (
    <>
    <div className="background">
     <div ref={containerRef} style={{ position: "relative", height: "90vh", width: "90vw" }}>
      <div style={{height:"100%", width:"100%"}}>
        <Stage
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          height={viewHeight}
          width={viewWidth}
        >
          <Layer>
            {[...drawings, currentlyDrawnShape].map((drawing) => {
              if (drawing?.name === DrawAction.MultiPointLine) {
                return (
                  <MultiPointLine
                    {...drawing}
                    closed={drawing?.id !== currentlyDrawnShape?.id}
                    activatePoints={
                      drawing?.id === currentlyDrawnShape?.id ||
                      drawing?.id === currentSelectedShape?.attrs?.id
                    }
                    isSelected={drawing?.id === currentSelectedShape?.attrs?.id}
                    onPointDrag={(newPoints) => {
                      setDrawings((prevDrawings) =>
                        prevDrawings.map((drawing) => {
                          if (drawing.id === currentSelectedShape?.attrs?.id) {
                            return { ...drawing, points: newPoints };
                          } else return drawing;
                        })
                      );
                    }}
                    {...shapeProps}
                  />
                );
              }
            })}

            <Transformer ref={transformerRef} rotateEnabled={false} />
          </Layer>
        </Stage>
      </div>
    </div>    
    <div className="btn-container">
          <GradientButton points={drawings[0]} text="Triangulate" action={() => {
          const [triangles, solution] = sendData(drawings[0].points);
          const polygon = drawings[0].points;
          
          if(triangles && solution && polygon){
            navigate("/triangulation", { state: { triangles, solution, polygon } });
          }

          }}></GradientButton>
          <GradientButton action={() => {navigate("/info")}} text="info"></GradientButton>
     </div>
    </div>
    </>

  );
});
