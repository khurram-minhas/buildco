import UndoIcon from "@mui/icons-material/Undo";
import { Typography } from "@mui/material";
import { MutableRefObject, useRef, useState } from "react";
import CustomButton from "../reusables/Button";

type propsType = {
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Undo = ({
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

    if (undoStack.current.length > 0) {
      const top = undoStack.current.pop()!;
      redoStack.current.push(captureStates);
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
      disabled={undoStack.current.length <= 0}
    >
      <UndoIcon
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
        Undo
      </Typography>
    </CustomButton>
  );
};

export default Undo;
