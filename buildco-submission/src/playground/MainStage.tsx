import Konva from "konva";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import ScaleMeasurementModal from "../modal/ScaleMeasurementModal";
import {
  activeGroupType,
  activeToolOptions,
  annotateType,
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import Annotate from "./Annotate";
import Count from "./Count";
import Deduct from "./Deduct";
import Length from "./Length";
import Polygon from "./Polygon";
import Rectangle from "./Rectangle";
import Scale from "./Scale";
import Select from "./Select";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  blob: HTMLImageElement;
  zoomLevel: number;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  count: countType[];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
  annotate: annotateType[];
  changeAnnotate: React.Dispatch<React.SetStateAction<annotateType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  setIsDrawingActive: (isDrawingActive) => void;
  captureStates: () => void;
};

const MainStage = ({
  selectedPdf,
  selectedPage,
  blob,
  zoomLevel,
  activeTool,
  changeActiveTool,
  scaleInfo,
  changeScaleInfo,
  polygon,
  changePolygon,
  length,
  changeLength,
  count,
  changeCount,
  annotate,
  changeAnnotate,
  activeGroup,
  group,
  undoStack,
  redoStack,
  captureStates,
  setIsDrawingActive,
}: propsType): JSX.Element => {
  const stageRef = useRef<Konva.Stage>(null);

  const enteredScale = useRef<any>();
  const [showScaleModal, setShowScaleModal] = useState<boolean>(false);

  const scaleFactor =
    zoomLevel >= 50
      ? 0.5 * (1 + (zoomLevel - 50) / 50.0)
      : 0.5 * (1 + (0.5 * (zoomLevel - 50)) / 50.0);

  useEffect(() => {
    if (activeTool === activeToolOptions.pan) {
      stageRef.current?.getStage().draggable(true);
    } else {
      stageRef.current?.getStage().draggable(false);
    }
  }, [activeTool]);

  const onDragStart = () => {
    // setIsDrawingActive(true);
  }

  return (
    <>
      <Stage
        width={Math.max(blob.width, window.innerWidth)}
        height={Math.max(blob.height, window.innerHeight)}
        scaleX={scaleFactor}
        scaleY={scaleFactor}
        ref={stageRef}
      >
        <Layer name="imageLayer">
          <Image id="image" image={blob} />
        </Layer>
        {[activeToolOptions.scale].includes(activeTool) && (
          <Scale
            scaleFactor={scaleFactor}
            stageRef={stageRef}
            scaleInfo={scaleInfo}
            changeScaleInfo={changeScaleInfo}
            changeShowScaleModal={setShowScaleModal}
            enteredScale={enteredScale}
            activeTool={activeTool}
          />
        )}
        {[activeToolOptions.rectangle].includes(activeTool) && (
          <Rectangle
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            polygon={polygon}
            changePolygon={changePolygon}
            group={group}
            activeGroup={activeGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        {[
          activeToolOptions.pan,
          activeToolOptions.polygon,
          activeToolOptions.length,
          activeToolOptions.count,
          activeToolOptions.annotate,
        ].includes(activeTool) && (
          <Polygon
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            polygon={polygon}
            changePolygon={changePolygon}
            group={group}
            activeGroup={activeGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        {[
          activeToolOptions.pan,
          activeToolOptions.rectangle,
          activeToolOptions.polygon,
          activeToolOptions.length,
          activeToolOptions.count,
          activeToolOptions.annotate,
        ].includes(activeTool) && (
          <Length
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            length={length}
            changeLength={changeLength}
            group={group}
            activeGroup={activeGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        {[activeToolOptions.select].includes(activeTool) && (
          <Select
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            activeTool={activeTool}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            scaleInfo={scaleInfo}
            group={group}
            polygon={polygon}
            changePolygon={changePolygon}
            length={length}
            changeLength={changeLength}
            count={count}
            changeCount={changeCount}
            annotate={annotate}
            changeAnnotate={changeAnnotate}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        {[activeToolOptions.deduct].includes(activeTool) && (
          <Deduct
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            activeTool={activeTool}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            scaleInfo={scaleInfo}
            polygon={polygon}
            changePolygon={changePolygon}
            group={group}
            activeGroup={activeGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        {[
          activeToolOptions.pan,
          activeToolOptions.rectangle,
          activeToolOptions.polygon,
          activeToolOptions.length,
          activeToolOptions.count,
          activeToolOptions.annotate,
        ].includes(activeTool) && (
          <Count
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            count={count}
            changeCount={changeCount}
            group={group}
            activeGroup={activeGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        {[
          activeToolOptions.rectangle,
          activeToolOptions.polygon,
          activeToolOptions.count,
          activeToolOptions.length,
          activeToolOptions.annotate,
          activeToolOptions.pan,
        ].includes(activeTool) && (
          <Annotate
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            annotate={annotate}
            changeAnnotate={changeAnnotate}
            group={group}
            activeGroup={activeGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
      </Stage>
      {showScaleModal && (
        <ScaleMeasurementModal
          selectedPdf={selectedPdf}
          selectedPage={selectedPage}
          enteredScale={enteredScale.current}
          scaleInfo={scaleInfo}
          changeScaleInfo={changeScaleInfo}
          changeShowScaleModal={setShowScaleModal}
        />
      )}
    </>
  );
};

export default MainStage;
