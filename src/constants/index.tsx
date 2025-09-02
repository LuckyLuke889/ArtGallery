import { ArrowUpRight, PenFill } from "react-bootstrap-icons";

export enum DrawAction {
  MultiPointLine = "multipointline",
  Select = "select",
  Scribble = "scribble",
}

export const DRAW_OPTIONS = [
  {
    id: DrawAction.MultiPointLine,
    icon: <PenFill />,
  },
];

export const MULTI_POINT_LINE_BG = "#a5d8ff";
export const SCRIBBLE_BG = "#ffc9c9";
export const STROKE_COLOR = "#000";
export const MULTI_POINT_LINE_CIRCLE_HOVER_BG = "#afabee";
export const MULTI_POINT_LINE_CIRCLE_STROKE = "#8986E3";
