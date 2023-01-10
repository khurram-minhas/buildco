import { Box, BoxProps, styled } from "@mui/material";
import { MutableRefObject, useContext } from "react";
import { Context } from "../Context";
import {
  countType,
  groupType,
  groupTypeName,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import Title from "./Title";
import ShapeGroup from "./ShapeGroup";
import LengthGroup from "./LengthGroup";
import CountGroup from "./CountGroup";
import DefaultGroup from "./DefaultGroup";
import CustomButton from "../reusables/Button";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  scaleInfo: scaleInfoType;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  polygon: polygonType[][][];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[][][];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  count: countType[][][];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
  isGroupOpen: boolean;
  toggleShowEstimate: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowCost: React.Dispatch<React.SetStateAction<boolean>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const MeasurementSection = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  group,
  changeGroup,
  polygon,
  changePolygon,
  length,
  changeLength,
  count,
  changeCount,
  isGroupOpen,
  toggleShowEstimate,
  toggleShowCost,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const context = useContext(Context);

  return (
    <Container
      navHeight={context.navHeight}
      sx={{ cursor: "pointer" }}
      isGroupOpen={isGroupOpen}
    >
      <Box
        sx={{
          overflow: "hidden",
          overflowY: "auto",
          maxHeight: "calc(100vh - 300px)",
        }}
      >
        <Title />
        {group.map((grp, index) => (
          <div key={grp.id}>
            {grp.type === groupTypeName.shape ? (
              <ShapeGroup
                selectedPdf={selectedPdf}
                selectedPage={selectedPage}
                scaleInfo={scaleInfo}
                key={index}
                groupIndex={index}
                group={grp}
                groups={group}
                changeGroup={changeGroup}
                polygon={polygon[selectedPdf][selectedPage]}
                changePolygon={changePolygon}
                undoStack={undoStack}
                redoStack={redoStack}
                captureStates={captureStates}
              />
            ) : grp.type === groupTypeName.length ? (
              <LengthGroup
                selectedPdf={selectedPdf}
                selectedPage={selectedPage}
                scaleInfo={scaleInfo}
                key={index}
                groupIndex={index}
                group={grp}
                groups={group}
                changeGroup={changeGroup}
                length={length[selectedPdf][selectedPage]}
                changeLength={changeLength}
                undoStack={undoStack}
                redoStack={redoStack}
                captureStates={captureStates}
              />
            ) : grp.type === groupTypeName.all ? (
              <></>
            ) : (
              <CountGroup
                selectedPdf={selectedPdf}
                selectedPage={selectedPage}
                scaleInfo={scaleInfo}
                key={index}
                groupIndex={index}
                group={grp}
                groups={group}
                changeGroup={changeGroup}
                count={count[selectedPdf][selectedPage]}
                changeCount={changeCount}
                undoStack={undoStack}
                redoStack={redoStack}
                captureStates={captureStates}
              />
            )}
          </div>
        ))}
        <DefaultGroup
          selectedPdf={selectedPdf}
          selectedPage={selectedPage}
          scaleInfo={scaleInfo}
          groupIndex={group.findIndex((grp) => grp.type === groupTypeName.all)}
          group={group.find((grp) => grp.type === groupTypeName.all)!}
          groups={group}
          changeGroup={changeGroup}
          polygon={polygon[selectedPdf][selectedPage]}
          changePolygon={changePolygon}
          length={length[selectedPdf][selectedPage]}
          changeLength={changeLength}
          count={count[selectedPdf][selectedPage]}
          changeCount={changeCount}
          undoStack={undoStack}
          redoStack={redoStack}
          captureStates={captureStates}
        />
      </Box>
      <Box
        sx={{
          marginTop: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CustomButton
          backgroundcolor="#ffa700"
          hoverbackgroudcolor="#ff8700"
          Color="white"
          hovercolor="white"
          sx={{
            borderRadius: "4px",
            padding: "3px 6px",
            height: "35px",
          }}
          onClick={() => {
            toggleShowCost(false);
            toggleShowEstimate(true);
          }}
        >
          Create Estimate
        </CustomButton>
      </Box>
    </Container>
  );
};

export default MeasurementSection;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
  isGroupOpen: boolean;
}
const Container = styled(Box)<CustomBoxProps>(
  ({ theme, navHeight, isGroupOpen }) => ({
    position: "fixed",
    top: "50px",
    right: isGroupOpen ? `calc(50% - 715px)` : `calc(50% - 515px)`,
    width: "510px",
    backgroundColor: "white",
    borderRadius: "32px",
    boxShadow: "0px 3px 4px 0px gray",
    padding: "75px 0px 40px 0px",
    paddingLeft: "25px",
    paddingRight: "25px",
    boxSizing: "border-box",
    zIndex: 600,

    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center !important",
    cursor: "auto !important",
  })
);
