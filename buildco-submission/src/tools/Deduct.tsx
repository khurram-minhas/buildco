import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as DeductIcon } from "../assets/icons/deduct.svg";

type propsType = {
  activeTool: activeToolOptions;
  isDrawingActive: boolean;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Deduct = ({ activeTool, isDrawingActive, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.deduct);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.deduct || !isDrawingActive}
    >
      <DeductIcon
        fill={`${
          activeTool === activeToolOptions.deduct && isDrawingActive ? "#FFBC01" : "currentColor"
        }`}
        style={{ width: "16px", height: "18px" }}
      />

      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.deduct ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Deduct
      </Typography>
    </CustomButton>
  );
};

export default Deduct;
