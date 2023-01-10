import Crop54SharpIcon from "@mui/icons-material/Crop54Sharp";
import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  isDrawingActive: boolean;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Rectangle = ({
  activeTool,
  isDrawingActive,
  changeActiveTool,
}: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.rectangle);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.rectangle || !isDrawingActive}
    >
      <Crop54SharpIcon
        fontSize="medium"
        style={{
          width: "20px",
          height: "20px",
          color: `${
            activeTool === activeToolOptions.rectangle ? "#FFBC01" : "inherit"
          }`,
        }}
      />
      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.rectangle ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Rectangle
      </Typography>
    </CustomButton>
  );
};

export default Rectangle;
