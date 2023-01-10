import _ from "lodash";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import {
  createRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Group, Layer, Rect, Shape, Text, Transformer } from "react-konva";
import {
  activeGroupType,
  activeToolOptions,
  deductRectType,
  groupType,
  polygonType,
  scaleInfoType,
  unitType,
} from "../utils";
import * as turf from "@turf/turf";
import { getPairedPoint, polygonArea, rgba2hex } from "../reusables/helpers";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Deduct = ({
  selectedPdf,
  selectedPage,
  activeTool,
  stageRef,
  scaleFactor,
  scaleInfo,
  polygon,
  changePolygon,
  group,
  activeGroup,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const polygonRef = useRef(polygon.map(() => createRef<Konva.Shape>()));

  const [newDeductRect, setNewDeductRect] = useState<deductRectType[]>([]);

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.deduct) {
      needCleanup.current = true;
    }
    return () => {
      if (needCleanup.current) {
        text.hide();
        setNewDeductRect([]);
      }
    };
  }, [activeTool]);

  const handleMouseDown = (
    index: number,
    event: KonvaEventObject<MouseEvent>
  ) => {
    (layerRef.current?.getStage()?.container())!.style!.cursor = "crosshair";
    if (newDeductRect.length > 0) setNewDeductRect([]);
    const text = tooltipRef.current!;
    const { x, y } = event.target.getStage()!.getPointerPosition()!;
    const newRectObj: deductRectType = {
      points: [
        (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      ],
      key: index,
    };
    const { calibrated } = scaleInfo[selectedPdf][selectedPage];
    text.text(
      0 +
        (calibrated === false
          ? " px2"
          : group.find((grp) => grp.id === activeGroup.shape)?.unit ===
            unitType.ft
          ? " ft2"
          : " in2")
    );
    text.position({
      x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
      y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
    });
    text.show();
    setNewDeductRect([newRectObj]);
  };
  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (newDeductRect.length === 1) {
      const text = tooltipRef.current!;
      const copyRect = _.cloneDeep(newDeductRect[0]);
      while (copyRect.points.length > 2) copyRect.points.pop();
      const prevX = copyRect.points[0];
      const prevY = copyRect.points[1];

      const { x, y } = event.target.getStage()!.getPointerPosition()!;
      const curX = (x - (stageRef.current?.attrs.x | 0)) / scaleFactor;
      const curY = (y - (stageRef.current?.attrs.y | 0)) / scaleFactor;

      const newRectObj: deductRectType = {
        ...copyRect,
        points:
          (curX >= prevX && curY >= prevY) || (curX < prevX && curY < prevY)
            ? [prevX, prevY, curX, prevY, curX, curY, prevX, curY]
            : [prevX, prevY, prevX, curY, curX, curY, curX, prevY],
      };

      const polyPoints = polygon[newRectObj.key - 1].points;
      const deductPoints = polygon[newRectObj.key - 1].deductRect;

      const isWithin = turf.booleanWithin(
        turf.polygon([
          getPairedPoint([
            ...newRectObj.points,
            newRectObj.points[0],
            newRectObj.points[1],
          ]),
        ]),
        turf.polygon([
          getPairedPoint([...polyPoints, polyPoints[0], polyPoints[1]]),
        ])
      );

      let isIntersect = false;
      for (const prevDeduct of deductPoints) {
        const intersect = turf.intersect(
          turf.polygon([
            getPairedPoint([
              ...prevDeduct.points,
              prevDeduct.points[0],
              prevDeduct.points[1],
            ]),
          ]),
          turf.polygon([
            getPairedPoint([
              ...newRectObj.points,
              newRectObj.points[0],
              newRectObj.points[1],
            ]),
          ])
        );
        if (intersect) {
          isIntersect = true;
          break;
        }
      }

      if (isWithin && isIntersect === false) {
        if (newRectObj.points.length >= 6) {
          const { x, y, L, calibrated } = scaleInfo[selectedPdf][selectedPage];
          const areaPx = polygonArea(newRectObj.points);
          if (calibrated === false) text.text(areaPx.toFixed(2) + " px2");
          else {
            const area = (areaPx * L * L) / (x * x + y * y);
            if (
              group.find((grp) => grp.id === activeGroup.shape)?.unit ===
              unitType.ft
            )
              text.text(area.toFixed(2) + " ft2");
            else text.text((144 * area).toFixed(2) + " in2");
          }
        } else {
          const { calibrated } = scaleInfo[selectedPdf][selectedPage];
          text.text(
            0 +
              (calibrated === false
                ? " px2"
                : group.find((grp) => grp.id === activeGroup.shape)?.unit ===
                  unitType.ft
                ? " ft2"
                : " in2")
          );
        }
        text.position({
          x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
          y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
        });
        setNewDeductRect([newRectObj]);
      }
    }
  };
  const handleMouseUp = (event: KonvaEventObject<MouseEvent>) => {
    (layerRef.current?.getStage()?.container())!.style!.cursor = "default";
    if (newDeductRect.length === 1) {
      const text = tooltipRef.current!;
      text.hide();
      const copyRect = _.cloneDeep(newDeductRect[0]);
      while (copyRect.points.length > 2) copyRect.points.pop();
      const prevX = copyRect.points[0];
      const prevY = copyRect.points[1];

      const { x, y } = event.target.getStage()!.getPointerPosition()!;
      const curX = (x - (stageRef.current?.attrs.x | 0)) / scaleFactor;
      const curY = (y - (stageRef.current?.attrs.y | 0)) / scaleFactor;

      const newRectObj: deductRectType = {
        ...copyRect,
        points:
          (curX >= prevX && curY >= prevY) || (curX < prevX && curY < prevY)
            ? [prevX, prevY, curX, prevY, curX, curY, prevX, curY]
            : [prevX, prevY, prevX, curY, curX, curY, curX, prevY],
      };

      const polyPoints = polygon[newRectObj.key - 1].points;
      const deductPoints = polygon[newRectObj.key - 1].deductRect;

      const isWithin = turf.booleanWithin(
        turf.polygon([
          getPairedPoint([
            ...newRectObj.points,
            newRectObj.points[0],
            newRectObj.points[1],
          ]),
        ]),
        turf.polygon([
          getPairedPoint([...polyPoints, polyPoints[0], polyPoints[1]]),
        ])
      );

      let isIntersect = false;
      for (const prevDeduct of deductPoints) {
        const intersect = turf.intersect(
          turf.polygon([
            getPairedPoint([
              ...prevDeduct.points,
              prevDeduct.points[0],
              prevDeduct.points[1],
            ]),
          ]),
          turf.polygon([
            getPairedPoint([
              ...newRectObj.points,
              newRectObj.points[0],
              newRectObj.points[1],
            ]),
          ])
        );
        if (intersect) {
          isIntersect = true;
          break;
        }
      }

      let finalObj = newDeductRect[0];
      if (isWithin && isIntersect === false && newRectObj.points.length >= 8) {
        finalObj = newRectObj;
      } else if (newDeductRect[0].points.length >= 8) {
        finalObj = newDeductRect[0];
      } else {
        setNewDeductRect([]);
        return;
      }

      undoStack.current.push(captureStates);
      redoStack.current.length = 0;
      while (undoStack.current.length > 30) undoStack.current.shift();
      changePolygon((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const currentList = prevCopy[selectedPdf][selectedPage];
        const currentObj = currentList[finalObj.key - 1];
        currentObj.deductRect.push({
          ...finalObj,
        });
        currentList[finalObj.key - 1] = currentObj;
        prevCopy[selectedPdf][selectedPage] = currentList;
        return prevCopy;
      });
    }
    setNewDeductRect([]);
  };

  return (
    <Layer
      name="deducttLayer"
      ref={layerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="deduct-tooltip"
        ref={tooltipRef}
        text=""
        fontFamily="Calibri"
        fontSize={25 / scaleFactor}
        padding={5}
        textFill="white"
        fill="black"
        alpha={1}
      />

      {polygon.map((item, index) => (
        <Group
          key={item.key}
          clipFunc={(ctx) => {
            ctx.beginPath();

            ctx.moveTo(item.points[0], item.points[1]);
            for (let idx = 2; idx < item.points.length; idx += 2) {
              ctx.lineTo(item.points[idx], item.points[idx + 1]);
            }
            ctx.closePath();

            const totalDeductRect =
              newDeductRect.length > 0 && item.key === newDeductRect[0].key
                ? [...item.deductRect, newDeductRect[0]]
                : item.deductRect;
            for (let idx = 0; idx < totalDeductRect.length; idx++) {
              const points = totalDeductRect[idx].points;
              const len = points.length;

              ctx.moveTo(points[len - 2], points[len - 1]);
              for (let index = len - 3; index > 0; index -= 2) {
                ctx.lineTo(points[index - 1], points[index]);
              }
              ctx.closePath();
            }
          }}
        >
          <Shape
            ref={polygonRef.current[index]}
            key={item.key}
            fill={
              item.hover
                ? "pink"
                : rgba2hex(group.find((grp) => grp.id === item.group)?.color)
            }
            stroke="black"
            strokeWidth={2 / scaleFactor}
            opacity={0.25}
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(item.points[0], item.points[1]);
              const points = item.points;
              for (let idx = 2; idx < points.length; idx += 2)
                ctx.lineTo(points[idx], points[idx + 1]);

              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            onMouseDown={(event) => handleMouseDown(item.key, event)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </Group>
      ))}

      <Transformer ref={trRef} />
    </Layer>
  );
};
export default Deduct;
