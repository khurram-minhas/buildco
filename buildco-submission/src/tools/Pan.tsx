import OpenWithIcon from "@mui/icons-material/OpenWith";
import { Typography } from "@mui/material";

import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Pan = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions["pan"]);
  };
  return (
    <>
      <CustomButton
        sx={{
          padding: "0px 6px",
          display: "flex",
          flexFlow: "column nowrap",
        }}
        onClick={handleChangeActiveTool}
        disabled={activeTool === activeToolOptions["pan"]}
      >
        <OpenWithIcon
          fontSize="small"
          style={{
            width: "20px",
            height: "20px",
            color: `${
              activeTool === activeToolOptions.pan ? "#FFBC01" : "inherit"
            }`,
          }}
        />
        <Typography
          fontSize={12}
          sx={{
            color: `${
              activeTool === activeToolOptions.pan ? "#FFBC01" : "inherit"
            }`,
          }}
        >
          Pan
        </Typography>
      </CustomButton>
    </>
  );
};

export default Pan;
