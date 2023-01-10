import { Box, styled, Typography } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";
import CustomButton from "../reusables/Button";
import {
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import EstimatePerPdf from "./EstimatePerPdf";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type propsType = {
  pdfOrder: number[];
  fileName: string[];
  scaleInfo: scaleInfoType[][];
  group: groupType[];
  polygon: polygonType[][][];
  length: lengthType[][][];
  count: countType[][][];
  toggleShowEstimate: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowCost: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveDetails: () => void;
};

const EstimateSection = ({
  pdfOrder,
  fileName,
  scaleInfo,
  group,
  polygon,
  length,
  count,
  toggleShowEstimate,
  toggleShowCost,
  onSaveDetails,
}: propsType): JSX.Element => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const hiddenText = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ToolBar>
          <LogoIcon style={{ width: "80px", paddingRight: "10px" }} />

          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              marginLeft: "25px",
              borderRadius: "4px",
              padding: "3px 6px",
              height: "30px",
            }}
            onClick={() => {
              toggleShowCost(false);
              toggleShowEstimate(false);
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
              }}
            >
              <ReplyIcon fontSize="small" />
              Back to Measure
            </Box>
          </CustomButton>
          <Typography
            sx={{
              marginLeft: "110px",
              color: "#222222",
              fontSize: "23px",
              fontWeight: "500",
            }}
          >
            All Measurements
          </Typography>
          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              position: "absolute",
              right: "30px",
              borderRadius: "4px",
              padding: "3px 6px",
              height: "30px",
              fontSize: "14px",
            }}
            onClick={useReactToPrint({
              content: () => pdfRef.current,
              onBeforeGetContent: () => {
                hiddenText.current!.style.display = "flex";
              },
              onAfterPrint: () => {
                hiddenText.current!.style.display = "none";
              },
            })}
          >
            Export as PDF
          </CustomButton>
        </ToolBar>

        <EstimateModal>
          <Box
            ref={pdfRef}
            sx={{
              margin: "30px 30px",
              overflow: "hidden",
              overflowY: "auto",
            }}
          >
            <Box
              ref={hiddenText}
              sx={{
                width: "1025px",
                marginBottom: "15px",
                justifyContent: "space-between",
                alignItems: "center",
                display: "none",
              }}
            >
              <LogoIcon style={{ width: "150px" }} />
              <Typography
                sx={{
                  color: "#FFBC01",
                  fontSize: "24px",
                  fontWeight: "500",
                }}
              >
                All Measurements
              </Typography>
            </Box>
            {pdfOrder.map((order) => (
              <EstimatePerPdf
                key={order}
                scaleInfo={scaleInfo[order]}
                fileName={fileName[order]}
                group={group}
                polygon={polygon[order]}
                length={length[order]}
                count={count[order]}
              />
            ))}
          </Box>
          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              margin: "20px 0px",
              borderRadius: "4px",
              padding: "3px 6px",
              height: "35px",
            }}
            onClick={() => {
              toggleShowEstimate(false);
              toggleShowCost(true);
            }}
          >
            Calculate Cost
          </CustomButton>
          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              margin: "20px 0px",
              borderRadius: "4px",
              padding: "3px 6px",
              height: "35px",
            }}
            onClick={onSaveDetails}
          >
            Save
          </CustomButton>
        </EstimateModal>
      </Box>
    </>
  );
};

export default EstimateSection;

const ToolBar = styled(Box)({
  position: "fixed",
  top: "40px",
  width: "1030px",
  boxSizing: "border-box",
  backgroundColor: "white",
  borderRadius: "32px",
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingLeft: "30px",
  paddingRight: "30px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
  zIndex: 900,
});

const EstimateModal = styled(Box)({
  position: "fixed",
  top: "130px",
  maxHeight: `calc(100vh - 150px)`,
  backgroundColor: "white",
  borderRadius: "32px",
  boxShadow: "0px 0px 16px 0px #80808082",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  overflow: "hidden",
  zIndex: 900,
});
