import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as CountIcon } from "../assets/icons/count.svg";

type propsType = {
  activeTool: activeToolOptions;
  isDrawingActive: boolean;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Count = ({ activeTool, isDrawingActive, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.count);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.count || !isDrawingActive}
    >
      <CountIcon
        fill={`${
          activeTool === activeToolOptions.count && isDrawingActive ? "#FFBC01" : "currentColor"
        }`}
        style={{
          width: "20px",
          height: "20px",
        }}
      />

      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.count ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Count
      </Typography>
    </CustomButton>
  );
};

export default Count;
