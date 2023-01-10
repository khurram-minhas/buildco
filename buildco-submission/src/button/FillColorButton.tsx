import { Button, Menu, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { RGBColor, CompactPicker } from "react-color";

type propsType = {
  fillColor: RGBColor;
  changeFillColor: (newColor: RGBColor) => void;
  scaleFactor: number;
};

const FillColorButton = ({
  fillColor,
  changeFillColor,
  scaleFactor,
}: propsType): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        variant="outlined"
        disableElevation
        disableRipple
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              width: `${20 / scaleFactor}px`,
              height: `${20 / scaleFactor}px`,
            }}
          />
        }
        sx={{
          color: "#FFBC01",
          padding: `0px ${2 / scaleFactor}px`,
          margin: 0,
          minWidth: "auto",
          borderRadius: "0px",
          backgroundColor: `${anchorEl ? "#d9f0fa" : "white"}`,
          "&:hover": {
            backgroundColor: `${anchorEl ? "#d9f0fa" : "white"}`,
          },
          "& .MuiButton-endIcon": {
            margin: "0px",
          },
        }}
        onClick={handleOpen}
      >
        <Typography
          variant="button"
          textTransform="none"
          sx={{
            fontSize: `${14 / scaleFactor}px`,
          }}
        >
          Fill
        </Typography>
      </Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        id="basic-menu"
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <CompactPicker
          color={fillColor}
          onChange={(color) => {
            changeFillColor(color.rgb);
          }}
        />
      </Menu>
    </>
  );
};

export default FillColorButton;
