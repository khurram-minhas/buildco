import { RGBColor } from "react-color";

export enum activeToolOptions {
  select = "select",
  scale = "scale",
  pan = "pan",
  rectangle = "rectangle",
  polygon = "polygon",
  length = "length",
  count = "count",
  deduct = "deduct",
  annotate = "annotate",
}

export type scaleInfoType = {
  calibrated: boolean;
  x: number;
  y: number;
  L: number; //store in ft
};

export type polygonType = {
  name: string;
  points: number[];
  key: number;
  deductRect: deductRectType[];
  group: number;
  hover: boolean;
  height: number;
  depth: number;
  // pitch: number;
};

export type lengthType = {
  name: string;
  points: number[];
  key: number;
  group: number;
  hover: boolean;
};

export type countType = {
  points: number[];
  type: iconType;
  key: number;
  group: number;
  hover: boolean;
};

export type annotateType = {
  key: number;
  points: number[];
  text: string;
  fontColor: RGBColor;
  fontSize: number;
  backgroundColor: RGBColor;
};

export enum groupTypeName {
  shape = "shape",
  length = "length",
  count = "count",
  all = "all",
}
export enum unitType {
  ft = "ft",
  in = "in",
}
export enum iconType {
  circle = "CircleIcon",
  triangle = "ChangeHistoryIcon",
  square = "CropSquareIcon",
}
export type groupType = {
  id: number;
  name: string;
  type: groupTypeName;
  color: RGBColor;
  unit?: unitType;
  icon?: iconType;
  height?: number;
  depth?: number;
  // pitch?: number;
};
export type activeGroupType = {
  shape: number;
  length: number;
  count: number;
};

export type deductRectType = {
  points: number[];
  key: number;
};

export type costGroupType = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  material: number;
  labor: number;
  markup: number;
  room: number;
  tax: number;
};

export enum taxType {
  "None",
  "Material",
  "Labor",
  "Both",
}
export const rgbaColors = [
  { r: 255, g: 188, b: 1, a: 1 },
  { r: 208, g: 2, b: 27, a: 1 },
  { r: 245, g: 166, b: 35, a: 1 },
  { r: 139, g: 87, b: 42, a: 1 },
  { r: 126, g: 211, b: 33, a: 1 },
  { r: 144, g: 19, b: 254, a: 1 },
  { r: 155, g: 155, b: 155, a: 1 },
];

export const makeid = (length) =>{
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}