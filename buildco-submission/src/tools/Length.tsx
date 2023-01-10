import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as LengthIcon } from "../assets/icons/length.svg";

type propsType = {
  activeTool: activeToolOptions;
  isDrawingActive: boolean;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Length = ({ activeTool, isDrawingActive, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.length);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.length || !isDrawingActive}
    >
      <LengthIcon
        fill={`${
          activeTool === activeToolOptions.length && isDrawingActive ? "#FFBC01" : "currentColor"
        }`}
        style={{ width: "18px", height: "18px" }}
      />

      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.length ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Length
      </Typography>
    </CustomButton>
  );
};

export default Length;
