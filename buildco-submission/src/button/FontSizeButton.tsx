import { Box, Button, Input, Menu, Slider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import FormatSizeIcon from "@mui/icons-material/FormatSize";

type propsType = {
  fontSize: number;
  changeFontSize: (newSize: number) => void;
  scaleFactor: number;
};

const FontSizeButton = ({
  fontSize,
  changeFontSize,
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
        <FormatSizeIcon
          sx={{
            width: `${20 / scaleFactor}px`,
            height: `${20 / scaleFactor}px`,
          }}
        />
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
        <Box
          sx={{
            display: "flex",
            width: "180px",
            padding: "0px 5px 0px 10px",
            gap: "10px",
          }}
        >
          <Slider
            value={fontSize}
            onChange={(event, value) =>
              changeFontSize(Array.isArray(value) ? value[0] : value)
            }
            aria-labelledby="input-slider"
            size="small"
            min={1}
            max={100}
            sx={{
              width: "120px",
            }}
          />
          <Input
            value={fontSize}
            size="small"
            onChange={(event) => changeFontSize(+event.target.value)}
            sx={{
              width: "45px",
              padding: "0px",
              "&:before": {
                border: "none",
              },
              "&:after": {
                border: "none",
              },
            }}
            inputProps={{
              step: 1,
              min: 1,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Box>
      </Menu>
    </>
  );
};

export default FontSizeButton;
