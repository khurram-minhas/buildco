import RedoIcon from "@mui/icons-material/Redo";
import { Typography } from "@mui/material";
import { MutableRefObject, useRef, useState } from "react";
import CustomButton from "../reusables/Button";

type propsType = {
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Redo = ({
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const timerPool = useRef<NodeJS.Timeout[]>([]);
  const [click, setClick] = useState<boolean>(false);

  const handleClick = async () => {
    for (const timer of timerPool.current) {
      clearTimeout(timer);
    }
    timerPool.current.length = 0;

    setClick(true);
    const timer = setTimeout(() => {
      setClick(false);
    }, 100);
    timerPool.current.push(timer);

    if (redoStack.current.length > 0) {
      const top = redoStack.current.pop()!;
      undoStack.current.push(captureStates);
      while (undoStack.current.length > 30) undoStack.current.shift();
      top();
    }
  };
  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleClick}
      disabled={redoStack.current.length <= 0}
    >
      <RedoIcon
        fontSize="medium"
        style={{
          width: "20px",
          height: "20px",
          color: `${click ? "#FFBC01" : "inherit"}`,
        }}
      />
      <Typography
        fontSize={12}
        sx={{ color: `${click ? "#FFBC01" : "inherit"}` }}
      >
        Redo
      </Typography>
    </CustomButton>
  );
};

export default Redo;
