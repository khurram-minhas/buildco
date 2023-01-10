import {
  Box,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CustomButton from "../reusables/Button";
import React, { MouseEventHandler, useRef, useState } from "react";
import { scaleInfoType, unitType } from "../utils";
import { ReactComponent as ScaleIcon } from "../assets/icons/scale.svg";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CreatePortal from "../reusables/CreatePortal";

type propTypes = {
  selectedPdf: number;
  selectedPage: number;
  enteredScale: any;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  changeShowScaleModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const ScaleMeasurementModal = ({
  selectedPdf,
  selectedPage,
  enteredScale,
  scaleInfo,
  changeScaleInfo,
  changeShowScaleModal,
}: propTypes): JSX.Element => {
  const theme = useTheme();
  const textRef = useRef<any>(null);
  const [anchorElUnit, setAnchorElUnit] = useState<null | HTMLElement>(null);
  const openUnit = Boolean(anchorElUnit);
  const [unit, setUnit] = useState<unitType>(unitType.ft);

  const handleToggleUnit: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElUnit) {
      setAnchorElUnit(null);
    } else {
      setAnchorElUnit(event?.currentTarget);
    }
  };
  const handleCloseUnit = () => {
    setAnchorElUnit(null);
  };

  const onClose = () => {
    const text = textRef.current?.value as string;
    if (text.trim().length) {
      changeScaleInfo((prev) => {
        const temp = [...prev];
        const t = temp[selectedPdf];
        t.splice(selectedPage, 1, {
          calibrated: true,
          x: enteredScale.x,
          y: enteredScale.y,
          L: unit === unitType.ft ? +text.trim() : +text.trim() / 12.0,
        });
        temp[selectedPdf] = t;
        return temp;
      });
      changeShowScaleModal(false);
    } else {
      alert("invalid length");
    }
  };
  const onCancel = () => {
    changeShowScaleModal(false);
  };

  return (
    <CreatePortal>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <ScaleIcon style={{ height: "20px" }} />
          <Typography fontWeight="500">Set Scale</Typography>
          <Typography fontSize={14} sx={{ marginTop: "30px" }}>
            Enter known measurement between two points (ft/in):
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="ex:5"
              inputRef={textRef}
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "6px 10px",
                },
              }}
            />
            <Box
              onClick={handleToggleUnit}
              sx={{
                width: "50px",
                height: "33px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                backgroundColor: "#f4f4f4",
                padding: "2px 6px",
                ":hover": {
                  backgroundColor: "#e4e7ed",
                },
              }}
            >
              <Typography
                noWrap
                fontWeight="400"
                lineHeight="1.5"
                letterSpacing="0.00938em"
                fontSize="14px"
                sx={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {unit}
              </Typography>
              {openUnit ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </Box>
            <Menu
              id="basic-menu"
              anchorEl={anchorElUnit}
              open={openUnit}
              onClose={handleCloseUnit}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                paddingTop: "0px",
                "& .MuiPaper-root": {
                  minWidth: "50px",
                },
              }}
            >
              {["ft", "in"].map((unt, index) => (
                <MenuItem
                  key={index}
                  selected={unt === unit}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    color: theme.color.primary,
                    fontSize: "14px",
                  }}
                >
                  <Typography
                    onClick={() => {
                      handleCloseUnit();
                      setUnit(unt === unitType.ft ? unitType.ft : unitType.in);
                    }}
                    noWrap
                    sx={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flexGrow: 1,
                      fontSize: "15px",
                    }}
                  >
                    {unt}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onCancel}
              sx={{
                padding: "6px 8px",
                borderColor: "#FFBC01",
                ":hover": {
                  borderColor: "#FFBC01",
                },
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="#FFBC01"
              hoverbackgroudcolor="#ffa700"
              onClick={onClose}
              sx={{
                padding: "6px 20px",
              }}
            >
              Find Scale
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </CreatePortal>
  );
};
export default ScaleMeasurementModal;

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
