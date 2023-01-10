import { Box, styled, TextField, Typography, useTheme } from "@mui/material";
import CustomButton from "../reusables/Button";
import { groupType, groupTypeName, polygonType } from "../utils";
import { MutableRefObject, useEffect, useState } from "react";
import { ReactComponent as Settings } from "../assets/icons/settingsHeight.svg";
import _ from "lodash";

type propTypes = {
  onClose: () => void;
  type: string;
  id: number;
  area: string;
  unit: string;

  group: groupType;
  groupIndex: number;
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;

  selectedPdf: number;
  selectedPage: number;
  polygon: polygonType;
  polygonIndex: number;
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};
const AddDimensionModal = ({
  onClose,
  type,
  id,
  area,
  unit,
  selectedPdf,
  selectedPage,
  group,
  groupIndex,
  changeGroup,
  polygon,
  polygonIndex,
  changePolygon,
  undoStack,
  redoStack,
  captureStates,
}: propTypes): JSX.Element => {
  const theme = useTheme();
  const [height, setHeight] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);

  useEffect(() => {
    if (type === "group") {
      setHeight(group?.height!);
      setDepth(group?.depth!);
      // setPitch(group?.pitch!);
    } else {
      setHeight(polygon?.height!);
      setDepth(polygon?.depth!);
      // setPitch(polygon?.pitch!);
    }
  }, []);

  const handleUpdate = () => {
    undoStack.current.push(captureStates);
    redoStack.current.length = 0;
    while (undoStack.current.length > 30) undoStack.current.shift();
    if (type === "group") {
      changePolygon((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const polyList = prevCopy[selectedPdf][selectedPage].map((poly) => {
          if (poly.group === group?.id)
            return { ...poly, height: height, depth: depth };
          else {
            return { ...poly };
          }
        });
        prevCopy[selectedPdf][selectedPage] = polyList;
        return prevCopy;
      });
      changeGroup((prev) => {
        const prevCopy = _.cloneDeep(prev);
        prevCopy.splice(groupIndex, 1, {
          ...group,
          height: height,
          depth: depth,
          // pitch: pitch,
        });
        return prevCopy;
      });
    } else {
      changePolygon((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const polyList = prevCopy[selectedPdf][selectedPage];
        polyList.splice(polygonIndex, 1, {
          ...polygon,
          height: height,
          depth: depth,
          // pitch: pitch,
        });
        prevCopy[selectedPdf][selectedPage] = polyList;
        return prevCopy;
      });
    }
    onClose();
  };

  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "370px",
            display: "flex",
            flexFlow: "column nowrap",
            jusifyContent: "flex-start",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Settings />
          <Typography fontWeight="500">Add Dimension</Typography>
          <Box
            sx={{
              marginTop: "20px",
              padding: "0px 10px",
              height: "40px",
              width: "320px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.color.buttonHover,
            }}
          >
            <Typography
              sx={{
                maxWidth: "180px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              noWrap
            >
              {type === "group" ? group?.name : polygon?.name}
            </Typography>
            <Typography>{area}</Typography>
          </Box>

          <Box
            sx={{
              marginTop: "40px",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography>height/width</Typography>
              <TextField
                type="number"
                value={height}
                disabled={
                  (group.type !== groupTypeName.all &&
                    type === "polygon" &&
                    polygon?.height === 0) ||
                  depth > 0 ||
                  pitch > 0
                }
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0.0;
                  if (
                    (type === "group" || group.type === groupTypeName.all) &&
                    value >= 0
                  ) {
                    setHeight(value);
                  } else if (type === "polygon" && value > 0) {
                    setHeight(value);
                  }
                }}
                sx={{
                  width: "135px",
                  "& .MuiOutlinedInput-input": {
                    padding: "5px 10px",
                    height: "25px",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography>depth</Typography>
              <TextField
                type="number"
                value={depth}
                disabled={
                  (group.type !== groupTypeName.all &&
                    type === "polygon" &&
                    polygon?.depth === 0) ||
                  height > 0 ||
                  pitch > 0
                }
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0.0;
                  if (
                    (type === "group" || group.type === groupTypeName.all) &&
                    value >= 0
                  ) {
                    setDepth(value);
                  } else if (type === "polygon" && value > 0) {
                    setDepth(value);
                  }
                }}
                sx={{
                  width: "135px",
                  "& .MuiOutlinedInput-input": {
                    padding: "5px 10px",
                    height: "25px",
                  },
                }}
              />
            </Box>
            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography>pitch</Typography>
              <TextField
                value={pitch}
                disabled={
                  (group.type !== groupTypeName.all &&
                    type === "polygon" &&
                    polygon?.pitch === 0) ||
                  height > 0 ||
                  depth > 0
                }
                onChange={(e) => {
                  const value = +e.target.value;
                  if (
                    (type === "group" || group.type === groupTypeName.all) &&
                    value >= 0
                  ) {
                    setPitch(value);
                  } else if (type === "polygon" && value > 0) {
                    setPitch(value);
                  }
                }}
                sx={{
                  width: "105px",
                  "& .MuiOutlinedInput-input": {
                    padding: "5px 10px",
                    height: "25px",
                  },
                }}
              />
            </Box> */}
          </Box>

          <Box
            sx={{
              marginTop: "20px",
              padding: "0px 10px",
              height: "40px",
              width: "320px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.color.buttonHover,
            }}
          >
            <Typography
              sx={{
                maxWidth: "180px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              noWrap
            >
              total
            </Typography>
            <Typography>
              {height || depth
                ? parseFloat(area) * (height + depth)
                : parseFloat(area)}
            </Typography>
          </Box>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: "6px 8px",
                borderColor: "#FFBC01",
                ":hover": {
                  borderColor: "#FFBC01",
                },
              }}
            >
              CANCEL
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="#FFBC01"
              hoverbackgroudcolor="#ffa700"
              onClick={handleUpdate}
              sx={{
                padding: "6px 20px",
              }}
            >
              DONE
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default AddDimensionModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});
