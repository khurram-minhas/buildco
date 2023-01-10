import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  isDrawingActive: boolean;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Polygon = ({ activeTool, isDrawingActive, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.polygon);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.polygon || !isDrawingActive}
    >
      <HexagonOutlinedIcon
        fontSize="medium"
        style={{
          width: "20px",
          height: "20px",
          color: `${
            activeTool === activeToolOptions.polygon ? "#FFBC01" : "inherit"
          }`,
        }}
      />
      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.polygon ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Polygon
      </Typography>
    </CustomButton>
  );
};

export default Polygon;
