import _ from "lodash";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Group, Layer, Rect, Shape, Text } from "react-konva";
import {
  activeGroupType,
  activeToolOptions,
  groupType,
  polygonType,
  scaleInfoType,
  unitType,
} from "../utils";
import { polygonArea, rgba2hex } from "../reusables/helpers";

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

const Rectangle = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  polygon,
  changePolygon,
  group,
  activeGroup,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const [newPolygon, setNewPolygon] = useState<polygonType[]>([]);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.rectangle) {
      needCleanup.current = true;
      layerRef.current?.moveToTop();
    }
    return () => {
      if (needCleanup.current) {
        text.hide();
        setNewPolygon([]);
      }
    };
  }, [activeTool]);

  const handleMouseDownRectLayer = (event: any) => {
    if (activeTool !== activeToolOptions.rectangle) return;
    if (newPolygon.length === 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      const newPolygonObj: polygonType = {
        points: [
          (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
          (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
        ],
        name: `rect ${polygon.length + 1}`,
        key: polygon.length + 1,
        deductRect: [],
        group: activeGroup.shape,
        hover: false,
        height: 0,
        depth: 0,
        // pitch: 0,
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
      setNewPolygon([newPolygonObj]);
    }
  };

  const handleMouseMoveRectLayer = (event: any) => {
    if (activeTool !== activeToolOptions.rectangle) return;
    if (newPolygon.length === 1) {
      const text = tooltipRef.current!;
      const copyNewPolygon = _.cloneDeep(newPolygon[0]);
      while (copyNewPolygon.points.length > 2) copyNewPolygon.points.pop();

      const prevX = copyNewPolygon.points[0];
      const prevY = copyNewPolygon.points[1];
      const { x, y } = event.target.getStage().getPointerPosition();
      const curX = (x - (stageRef.current?.attrs.x | 0)) / scaleFactor;
      const curY = (y - (stageRef.current?.attrs.y | 0)) / scaleFactor;

      const newPolygonObj: polygonType = {
        ...copyNewPolygon,
        points:
          (curX >= prevX && curY >= prevY) || (curX < prevX && curY < prevY)
            ? [prevX, prevY, curX, prevY, curX, curY, prevX, curY]
            : [prevX, prevY, prevX, curY, curX, curY, curX, prevY],
      };

      if (newPolygonObj.points.length >= 6) {
        const { x, y, L, calibrated } = scaleInfo[selectedPdf][selectedPage];
        const areaPx = polygonArea(newPolygonObj.points);
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
      setNewPolygon([newPolygonObj]);
    }
  };
  const handleMouseUpRectLayer = (event: any) => {
    if (activeTool !== activeToolOptions.rectangle) return;
    if (newPolygon.length === 1 && newPolygon[0].points.length >= 8) {
      const copyNewPolygon = _.cloneDeep(newPolygon[0]);
      while (copyNewPolygon.points.length > 2) copyNewPolygon.points.pop();

      const prevX = copyNewPolygon.points[0];
      const prevY = copyNewPolygon.points[1];
      const { x, y } = event.target.getStage().getPointerPosition();
      const curX = (x - (stageRef.current?.attrs.x | 0)) / scaleFactor;
      const curY = (y - (stageRef.current?.attrs.y | 0)) / scaleFactor;

      const newPolygonObj: polygonType = {
        ...copyNewPolygon,
        points:
          (curX >= prevX && curY >= prevY) || (curX < prevX && curY < prevY)
            ? [prevX, prevY, curX, prevY, curX, curY, prevX, curY]
            : [prevX, prevY, prevX, curY, curX, curY, curX, prevY],
      };
      setNewPolygon([]);

      undoStack.current.push(captureStates);
      redoStack.current.length = 0;
      while (undoStack.current.length > 30) undoStack.current.shift();
      changePolygon((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const currentList = prevCopy[selectedPdf][selectedPage];
        currentList.push({ ...newPolygonObj });
        prevCopy[selectedPdf][selectedPage] = currentList;
        return prevCopy;
      });
    }
    const text = tooltipRef.current!;
    text.hide();
    setNewPolygon([]);
  };

  const polygonsToDraw = [...polygon, ...newPolygon];

  return (
    <Layer
      name="rectLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownRectLayer}
      onMouseMove={handleMouseMoveRectLayer}
      onMouseUp={handleMouseUpRectLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="rect-tooltip"
        ref={tooltipRef}
        text=""
        fontFamily="Calibri"
        fontSize={25 / scaleFactor}
        padding={5}
        textFill="white"
        fill="black"
        alpha={1}
      />
      {polygonsToDraw.map((item, index) => (
        <Group
          key={item.key}
          clipFunc={(ctx) => {
            ctx.beginPath();

            ctx.moveTo(item.points[0], item.points[1]);
            for (let idx = 2; idx < item.points.length; idx += 2) {
              ctx.lineTo(item.points[idx], item.points[idx + 1]);
            }
            if (item.points.length <= 4) {
              ctx.lineTo(item.points[2], item.points[2 + 1] + 0.1);
            }
            ctx.closePath();

            for (let idx = 0; idx < item.deductRect.length; idx++) {
              const points = item.deductRect[idx].points;
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
          />
        </Group>
      ))}
    </Layer>
  );
};

export default Rectangle;
