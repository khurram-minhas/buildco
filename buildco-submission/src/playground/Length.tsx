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
import { Layer, Rect, Line, Text } from "react-konva";
import {
  activeGroupType,
  activeToolOptions,
  groupType,
  lengthType,
  scaleInfoType,
  unitType,
} from "../utils";
import { getLength, rgba2hex } from "../reusables/helpers";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Length = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  length,
  changeLength,
  group,
  activeGroup,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const [newLength, setNewLength] = useState<lengthType[]>([]);
  const [movePoint, setMovePoint] = useState<number[]>([]);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.length) {
      needCleanup.current = true;
      layerRef.current?.moveToTop();
    }
    return () => {
      if (needCleanup.current) {
        text.hide();
        setNewLength([]);
        setMovePoint([]);
      }
    };
  }, [activeTool]);

  const handleMouseDownLengthLayer = (event: any) => {
    if (activeTool !== activeToolOptions.length) return;
    if (newLength.length === 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      const newLengthObj: lengthType = {
        points: [
          (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
          (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
        ],
        name: `length${length.length + 1}`,
        key: length.length + 1,
        group: activeGroup.length,
        hover: false,
      };

      const { calibrated } = scaleInfo[selectedPdf][selectedPage];
      text.text(
        0 +
          (calibrated === false
            ? " px"
            : group.find((grp) => grp.id === activeGroup.length)?.unit ===
              unitType.ft
            ? " ft"
            : " in")
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      text.show();
      setNewLength([newLengthObj]);
    } else {
      const text = tooltipRef.current!;
      const { x: cursorX, y: cursorY } = event.target
        .getStage()
        .getPointerPosition();

      const newLengthObj: lengthType = {
        ...newLength[0],
        points: [
          ...newLength[0].points,
          (cursorX - (stageRef.current?.attrs.x | 0)) / scaleFactor,
          (cursorY - (stageRef.current?.attrs.y | 0)) / scaleFactor,
        ],
      };

      const { x, y, L, calibrated } = scaleInfo[selectedPdf][selectedPage];
      const length = getLength(newLengthObj.points);
      if (calibrated === false) text.text(length.toFixed(2) + " px");
      else {
        const area = (length * L) / Math.sqrt(x * x + y * y);
        if (
          group.find((grp) => grp.id === activeGroup.length)?.unit ===
          unitType.ft
        )
          text.text(area.toFixed(2) + " ft");
        else text.text((12 * area).toFixed(2) + " in");
      }

      text.position({
        x: (cursorX - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
        y: (cursorY - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      setNewLength([newLengthObj]);
      setMovePoint([]);
    }
  };

  const handleMouseMoveLengthLayer = (event: any) => {
    if (activeTool !== activeToolOptions.length) return;
    if (newLength.length > 0) {
      const text = tooltipRef.current!;
      const { x: cursorX, y: cursorY } = event.target
        .getStage()
        .getPointerPosition();

      setMovePoint([
        (cursorX - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        (cursorY - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      ]);

      const newLengthObj: lengthType = {
        ...newLength[0],
        points: [
          ...newLength[0].points,
          (cursorX - (stageRef.current?.attrs.x | 0)) / scaleFactor,
          (cursorY - (stageRef.current?.attrs.y | 0)) / scaleFactor,
        ],
      };
      const { x, y, L, calibrated } = scaleInfo[selectedPdf][selectedPage];
      const length = getLength(newLengthObj.points);
      if (calibrated === false) text.text(length.toFixed(2) + " px");
      else {
        const area = (length * L) / Math.sqrt(x * x + y * y);
        if (
          group.find((grp) => grp.id === activeGroup.length)?.unit ===
          unitType.ft
        )
          text.text(area.toFixed(2) + " ft");
        else text.text((12 * area).toFixed(2) + " in");
      }

      text.position({
        x: (cursorX - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
        y: (cursorY - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
    }
  };

  const handleDblClickLengthLayer = (event: any) => {
    if (activeTool !== activeToolOptions.length) return;
    const text = tooltipRef.current!;
    text.hide();
    if (newLength.length > 0 && newLength[0].points.length >= 6) {
      const actualPoints = newLength[0].points;
      actualPoints.pop();
      actualPoints.pop();

      undoStack.current.push(captureStates);
      redoStack.current.length = 0;
      while (undoStack.current.length > 30) undoStack.current.shift();
      changeLength((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const temp = prevCopy[selectedPdf][selectedPage];
        temp.push({
          ...newLength[0],
          points: [...actualPoints],
        });
        prevCopy[selectedPdf][selectedPage] = temp;
        return prevCopy;
      });
    }
    setMovePoint([]);
    setNewLength([]);
  };

  const Obj: lengthType[] = [];
  if (newLength.length === 1) {
    Obj.push({
      ...newLength[0],
      points: [...newLength[0].points, ...movePoint],
    });
  }

  const lengthsToDraw = [...length, ...Obj];

  return (
    <Layer
      name="lengthLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownLengthLayer}
      onMouseMove={handleMouseMoveLengthLayer}
      onDblClick={handleDblClickLengthLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="length-tooltip"
        ref={tooltipRef}
        text=""
        fontFamily="Calibri"
        fontSize={25 / scaleFactor}
        padding={5}
        textFill="white"
        fill="black"
        alpha={1}
      />
      {lengthsToDraw.map((length) => (
        <Line
          key={length.key}
          points={length.points}
          stroke={
            length.hover
              ? "pink"
              : rgba2hex(group.find((grp) => grp.id === length.group)?.color)
          }
          strokeWidth={2 / scaleFactor}
          opacity={0.5}
        />
      ))}
    </Layer>
  );
};

export default Length;
