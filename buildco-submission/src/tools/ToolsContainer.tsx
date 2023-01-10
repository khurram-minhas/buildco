import { Box, styled } from "@mui/material";
import { MutableRefObject } from "react";
import { activeToolOptions } from "../utils";
import Annotate from "./Annotate";
import Count from "./Count";
import Deduct from "./Deduct";
import Length from "./Length";
import Page from "./Page";
import Pan from "./Pan";
import Polygon from "./Polygon";
import Rectangle from "./Rectangle";
import Redo from "./Redo";

import Scale from "./Scale";
import Select from "./Select";
import Undo from "./Undo";
import ZoomIn from "./ZoomIn";
import ZoomOut from "./ZoomOut";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
  isDrawingActive: boolean;
  setIsDrawingActive: (isDrawingActive: boolean) => void;
};

const ToolsContainer = ({
  selectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
  showPage,
  toggleShowPage,
  undoStack,
  redoStack,
  captureStates,
  isDrawingActive,
  setIsDrawingActive,
}: propsType): JSX.Element => {
  return (
    <Container>
      <Page isDrawingActive={isDrawingActive} showPage={showPage} toggleShowPage={toggleShowPage} />
      <Select isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Scale activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Rectangle isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Polygon isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Deduct isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Count isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Length isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Annotate isDrawingActive={isDrawingActive} activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Pan activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <ZoomIn
        selectedPdf={selectedPdf}
        selectedPage={selectedPage}
        currentZoomLevel={currentZoomLevel}
        changeZoomLevel={changeZoomLevel}
      />
      <ZoomOut
        selectedPdf={selectedPdf}
        selectedPage={selectedPage}
        currentZoomLevel={currentZoomLevel}
        changeZoomLevel={changeZoomLevel}
      />
      <Undo
        undoStack={undoStack}
        redoStack={redoStack}
        captureStates={captureStates}
      />
      <Redo
        undoStack={undoStack}
        redoStack={redoStack}
        captureStates={captureStates}
      />
    </Container>
  );
};

export default ToolsContainer;

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  color: theme.color.primary,
}));
