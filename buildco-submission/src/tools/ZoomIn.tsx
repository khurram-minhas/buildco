import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Typography } from "@mui/material";
import { useRef, useState } from "react";
import CustomButton from "../reusables/Button";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
};

const ZoomIn = ({
  selectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
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

    const newLevel = currentZoomLevel + 10;
    if (newLevel <= 100)
      changeZoomLevel((prev) => {
        const temp = [...prev];
        const selectedPdfZooms = temp[selectedPdf];
        selectedPdfZooms[selectedPage] = newLevel;
        temp.splice(selectedPdf, 1, selectedPdfZooms);
        return temp;
      });
  };
  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleClick}
      disabled={currentZoomLevel >= 100}
    >
      <ZoomInIcon
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
        Zoom In
      </Typography>
    </CustomButton>
  );
};

export default ZoomIn;
