import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import _ from "lodash";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { Circle, Layer, Rect, RegularPolygon } from "react-konva";
import { rgba2hex } from "../reusables/helpers";
import {
  activeGroupType,
  activeToolOptions,
  countType,
  groupType,
  iconType,
  scaleInfoType,
} from "../utils";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  count: countType[];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Count = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  count,
  changeCount,
  group,
  activeGroup,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (activeTool === activeToolOptions.count) {
      needCleanup.current = true;
      layerRef.current?.moveToTop();
    }
  }, [activeTool]);

  const handleMouseDownCountLayer = (event: any) => {
    if (activeTool !== activeToolOptions.count) return;

    const { x, y } = event.target.getStage().getPointerPosition();

    const newCountObj: countType = {
      points: [
        (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      ],
      key: count.length + 1,
      group: activeGroup.count,
      hover: false,
      type: group.find((grp) => grp.id === activeGroup.count)?.icon!,
    };

    undoStack.current.push(captureStates);
    redoStack.current.length = 0;
    while (undoStack.current.length > 30) undoStack.current.shift();
    changeCount((prev) => {
      const prevCopy = _.cloneDeep(prev);
      const temp = prevCopy[selectedPdf][selectedPage];
      temp.push(newCountObj);
      prevCopy[selectedPdf][selectedPage] = temp;
      return prevCopy;
    });
  };

  return (
    <Layer
      name="countLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownCountLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />

      {count
        .filter((cnt) => cnt.type === iconType.circle)
        .map((cnt) => (
          <Circle
            key={cnt.key}
            x={cnt.points[0]}
            y={cnt.points[1]}
            radius={10}
            fill={
              cnt.hover
                ? "pink"
                : rgba2hex(group.find((grp) => grp.id === cnt.group)?.color)
            }
            stroke="black"
            strokeWidth={1 / scaleFactor}
            opacity={0.5}
          />
        ))}
      {count
        .filter((cnt) => cnt.type === iconType.triangle)
        .map((cnt) => (
          <RegularPolygon
            key={cnt.key}
            sides={3}
            x={cnt.points[0]}
            y={cnt.points[1]}
            radius={10}
            fill={
              cnt.hover
                ? "pink"
                : rgba2hex(group.find((grp) => grp.id === cnt.group)?.color)
            }
            stroke="black"
            strokeWidth={1 / scaleFactor}
            opacity={0.5}
          />
        ))}

      {count
        .filter((cnt) => cnt.type === iconType.square)
        .map((cnt) => (
          <RegularPolygon
            key={cnt.key}
            sides={4}
            x={cnt.points[0]}
            y={cnt.points[1]}
            radius={10}
            fill={
              cnt.hover
                ? "pink"
                : rgba2hex(group.find((grp) => grp.id === cnt.group)?.color)
            }
            stroke="black"
            strokeWidth={1 / scaleFactor}
            opacity={0.5}
          />
        ))}
    </Layer>
  );
};

export default Count;
