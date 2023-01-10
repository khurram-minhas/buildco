import { MutableRefObject } from "react";

import { styled, Box, BoxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ToolsContainer from "../tools/ToolsContainer";
import {
  activeGroupType,
  activeToolOptions,
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import GroupSection from "../group/GroupSection";

type props = {
  onFileUpload: (files: FileList) => void;
  fileName: string[];
  pdfOrder: number[];
  changePdfOrder: React.Dispatch<React.SetStateAction<number[]>>;
  selectedPdf: number;
  changeSelectedPdf: React.Dispatch<React.SetStateAction<number>>;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  scaleInfo: scaleInfoType[][];
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
  showMeasurements: boolean;
  toggleShowMeasurements: React.Dispatch<React.SetStateAction<boolean>>;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  activeGroup: activeGroupType;
  changeActiveGroup: React.Dispatch<React.SetStateAction<activeGroupType>>;
  polygon: polygonType[][][];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[][][];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  count: countType[][][];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
  isDrawingActive: boolean;
  setIsDrawingActive: (isDrawingActive: boolean) => void;
};

const Header = ({
  onFileUpload,
  fileName,
  pdfOrder,
  changePdfOrder,
  selectedPdf,
  changeSelectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
  showPage,
  toggleShowPage,
  showMeasurements,
  toggleShowMeasurements,
  scaleInfo,
  group,
  changeGroup,
  activeGroup,
  changeActiveGroup,
  polygon,
  changePolygon,
  length,
  changeLength,
  count,
  changeCount,
  undoStack,
  redoStack,
  captureStates,
  isDrawingActive,
  setIsDrawingActive,
}: props): JSX.Element => {
  return (
    <Wrapper>
      <ToolBar
        isGroupOpen={
          activeTool === activeToolOptions.rectangle ||
          activeTool === activeToolOptions.polygon ||
          activeTool === activeToolOptions.length ||
          activeTool === activeToolOptions.count
        }
      >
        <LogoIcon style={{ width: "90px", paddingRight: "10px" }} />
        <ToolsContainer
          selectedPdf={selectedPdf}
          selectedPage={selectedPage}
          currentZoomLevel={currentZoomLevel}
          changeZoomLevel={changeZoomLevel}
          activeTool={activeTool}
          changeActiveTool={changeActiveTool}
          showPage={showPage}
          toggleShowPage={toggleShowPage}
          undoStack={undoStack}
          redoStack={redoStack}
          captureStates={captureStates}
          isDrawingActive={isDrawingActive}
          setIsDrawingActive={setIsDrawingActive}
        />

        {(activeTool === activeToolOptions.rectangle ||
          activeTool === activeToolOptions.polygon ||
          activeTool === activeToolOptions.length ||
          activeTool === activeToolOptions.count) && (
          <GroupSection
            activeTool={activeTool}
            group={group}
            changeGroup={changeGroup}
            activeGroup={activeGroup}
            changeActiveGroup={changeActiveGroup}
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        )}
        <Box
          onClick={() => toggleShowMeasurements((prev) => !prev)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            padding: "4px 6px 4px 10px",
            borderRadius: "12px",
            ":hover": {
              backgroundColor: "#e4e7ed",
            },
          }}
        >
          <Typography
            noWrap
            fontWeight="500"
            lineHeight="1.5"
            letterSpacing="0.00938em"
            fontSize="14px"
            sx={{
              color: "#4b4646",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            MEASUREMENTS
          </Typography>
          {showMeasurements ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowUpIcon />
          )}
        </Box>
      </ToolBar>
    </Wrapper>
  );
};

export default Header;

interface CustomBoxProps extends BoxProps {
  isGroupOpen: boolean;
}

const ToolBar = styled(Box)<CustomBoxProps>(({ isGroupOpen }) => ({
  position: "fixed",
  top: "50px",
  width: isGroupOpen ? "1430px" : "1030px",
  boxSizing: "border-box",
  backgroundColor: "white",
  borderRadius: "32px",
  // boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingLeft: "30px",
  paddingRight: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  zIndex: 900,
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
}));

const Wrapper = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});
