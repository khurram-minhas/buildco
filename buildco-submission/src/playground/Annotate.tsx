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
import { Layer, Rect, Text, Label, Tag } from "react-konva";
import {
  activeGroupType,
  activeToolOptions,
  annotateType,
  groupType,
  scaleInfoType,
} from "../utils";
import { rgba2hex } from "../reusables/helpers";
import { KonvaEventObject } from "konva/lib/Node";
import { Html } from "react-konva-utils";
import { Box, Typography } from "@mui/material";
import FontColorButton from "../button/FontColorButton";
import { RGBColor } from "react-color";
import FillColorButton from "../button/FillColorButton";
import FontSizeButton from "../button/FontSizeButton";
import DeleteButton from "../button/DeleteButton";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  annotate: annotateType[];
  changeAnnotate: React.Dispatch<React.SetStateAction<annotateType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Annotate = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  annotate,
  changeAnnotate,
  group,
  activeGroup,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const [editingTextId, setEditingTextId] = useState<string>("");
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (activeTool === activeToolOptions.annotate) {
      layerRef.current?.moveToTop();
    }
  }, [activeTool]);

  const handleMouseDownAnnotateLayer = (
    event: KonvaEventObject<MouseEvent>
  ) => {
    if (
      activeTool !== activeToolOptions.annotate ||
      event.target.id() !== "dummy-rect"
    )
      return;
    if (editingTextId) {
      layerRef.current
        ?.getLayer()
        .getChildren()
        .find((label) => label.attrs.id === editingTextId)
        ?.show();
      setEditingTextId("");
      return;
    }
    const { x, y } = event.target.getStage()!.getPointerPosition()!;
    const newAnnotate: annotateType = {
      key: new Date().getTime(),
      points: [
        (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      ],
      text: "add text",
      fontColor: { r: 0, g: 0, b: 0, a: 1 },
      fontSize: 40,
      backgroundColor: { r: 255, g: 188, b: 1, a: 1 },
    };
    changeAnnotate((prev) => {
      const prevCopy = _.cloneDeep(prev);
      const currentList = prevCopy[selectedPdf][selectedPage];
      currentList.push(newAnnotate);
      prevCopy[selectedPdf][selectedPage] = currentList;
      return prevCopy;
    });
  };

  const handleDragEnd = (event: KonvaEventObject<DragEvent>, id: number) => {
    const x = event.target.x();
    const y = event.target.y();
    changeAnnotate((prev) => {
      const prevCopy = _.cloneDeep(prev);
      const currentList = prevCopy[selectedPdf][selectedPage];
      const index = currentList.findIndex((anno) => anno.key === id);
      const prevAnno = currentList[index];
      currentList.splice(index, 1, {
        ...prevAnno,
        points: [x, y],
      });
      return prevCopy;
    });
  };

  const handleDblClick = (event: KonvaEventObject<MouseEvent>, id: number) => {
    if (activeTool !== activeToolOptions.annotate || editingTextId) return;
    event.target.parent!.hide();
    setEditingTextId(id.toString());
  };

  return (
    <Layer
      name="lengthLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownAnnotateLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      {annotate.map((anno) => (
        <Label
          id={anno.key.toString()}
          key={anno.key}
          x={anno.points[0]}
          y={anno.points[1]}
          opacity={0.75}
          draggable={
            activeTool === activeToolOptions.annotate ||
            activeTool === activeToolOptions.select
          }
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            handleDragEnd(e, anno.key);
            e.target._clearTransform();
            e.target.clearCache();
          }}
          onMouseEnter={() => {
            if (
              activeTool === activeToolOptions.annotate ||
              activeTool === activeToolOptions.select
            )
              (layerRef.current?.getStage()?.container())!.style!.cursor =
                "move";
          }}
          onMouseLeave={() => {
            if (
              activeTool === activeToolOptions.annotate ||
              activeTool === activeToolOptions.select
            )
              (layerRef.current?.getStage()?.container())!.style!.cursor =
                "default";
          }}
          onDblClick={(event: KonvaEventObject<MouseEvent>) => {
            if (
              activeTool === activeToolOptions.annotate ||
              activeTool === activeToolOptions.select
            )
              handleDblClick(event, anno.key);
          }}
        >
          <Tag fill={rgba2hex(anno.backgroundColor)} />
          <Text
            text={anno.text ? anno.text : "write here"}
            fill={rgba2hex(anno.fontColor)}
            fontSize={anno.fontSize}
          />
        </Label>
      ))}
      {editingTextId && (
        <Html
          divProps={{
            style: {
              top: `${
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.points[1]! * scaleFactor
              }px`,
              left: `${
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.points[0]! * scaleFactor
              }px`,
            },
          }}
        >
          <Typography
            contentEditable
            suppressContentEditableWarning={true}
            sx={{
              letterSpacing: "0px",
              lineHeight: `${
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.fontSize
              }px`,
              backgroundColor: rgba2hex(
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.backgroundColor
              ),
              color: rgba2hex(
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.fontColor
              ),
              fontSize: `${
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.fontSize
              }px`,
            }}
            onBlur={(e) => {
              changeAnnotate((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const currentList = prevCopy[selectedPdf][selectedPage];
                const index = currentList.findIndex(
                  (anno) => anno.key.toString() === editingTextId
                );
                const prevAnno = currentList[index];
                currentList.splice(index, 1, {
                  ...prevAnno,
                  text: e.target.innerText,
                });
                return prevCopy;
              });
            }}
          >
            {
              annotate.find((anno) => anno.key.toString() === editingTextId)
                ?.text
            }
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <FontColorButton
              scaleFactor={scaleFactor}
              fontColor={
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.fontColor!
              }
              changeFontColor={(newColor: RGBColor) => {
                changeAnnotate((prev) => {
                  const prevCopy = _.cloneDeep(prev);
                  const currentList = prevCopy[selectedPdf][selectedPage];
                  const index = currentList.findIndex(
                    (anno) => anno.key.toString() === editingTextId
                  );
                  const prevAnno = currentList[index];
                  currentList.splice(index, 1, {
                    ...prevAnno,
                    fontColor: newColor,
                  });
                  return prevCopy;
                });
              }}
            />
            <FillColorButton
              scaleFactor={scaleFactor}
              fillColor={
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.backgroundColor!
              }
              changeFillColor={(newColor: RGBColor) => {
                changeAnnotate((prev) => {
                  const prevCopy = _.cloneDeep(prev);
                  const currentList = prevCopy[selectedPdf][selectedPage];
                  const index = currentList.findIndex(
                    (anno) => anno.key.toString() === editingTextId
                  );
                  const prevAnno = currentList[index];
                  currentList.splice(index, 1, {
                    ...prevAnno,
                    backgroundColor: newColor,
                  });
                  return prevCopy;
                });
              }}
            />
            <FontSizeButton
              scaleFactor={scaleFactor}
              fontSize={
                annotate.find((anno) => anno.key.toString() === editingTextId)
                  ?.fontSize!
              }
              changeFontSize={(newSize: number) => {
                changeAnnotate((prev) => {
                  const prevCopy = _.cloneDeep(prev);
                  const currentList = prevCopy[selectedPdf][selectedPage];
                  const index = currentList.findIndex(
                    (anno) => anno.key.toString() === editingTextId
                  );
                  const prevAnno = currentList[index];
                  currentList.splice(index, 1, {
                    ...prevAnno,
                    fontSize: newSize,
                  });
                  return prevCopy;
                });
              }}
            />
            <DeleteButton
              scaleFactor={scaleFactor}
              changeAnnotate={() => {
                changeAnnotate((prev) => {
                  const prevCopy = _.cloneDeep(prev);
                  const currentList = prevCopy[selectedPdf][selectedPage];
                  const index = currentList.findIndex(
                    (anno) => anno.key.toString() === editingTextId
                  );
                  currentList.splice(index, 1);
                  return prevCopy;
                });
                setTimeout(() => {
                  setEditingTextId("");
                }, 10);
              }}
            />
          </Box>
        </Html>
      )}
    </Layer>
  );
};

export default Annotate;
