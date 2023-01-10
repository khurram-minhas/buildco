import { Box, Skeleton } from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type propTypes = {
  page: pdfjsLib.PDFPageProxy;
  previewPage: HTMLImageElement;
  height: number;
  width: number;
  ratio: number;
  pageNumber: number;
  isSelectedPage: boolean;
  changeSelectedPage: Dispatch<SetStateAction<number[]>>;
  selectedPdf: number;
};

const PreviewPdf = ({
  page,
  previewPage,
  height,
  width,
  ratio,
  pageNumber,
  isSelectedPage,
  changeSelectedPage,
  selectedPdf,
}: propTypes): JSX.Element => {
  const cnvRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const canvas = cnvRef.current;
      const ctx = canvas!.getContext("2d") as CanvasRenderingContext2D;

      canvas!.height = previewPage.height;
      canvas!.width = previewPage.width;
      ctx.drawImage(previewPage, 0, 0);
    }, pageNumber * 250);

    return () => {
      clearTimeout(timer);
    };
  }, [page]);

  return (
    <Box
      sx={{
        position: "relative",
        height: height * ratio,
        width: width * ratio,
        border: isSelectedPage ? "2px solid #FFBC01" : "2px solid transparent",
        boxShadow: "0 0 8px 0px rgb(0 0 0 / 20%)",
        ":hover": {
          boxShadow: "0 0 8px 4px rgb(0 0 0 / 20%)",
        },
      }}
    >
      {isLoading && (
        <Skeleton
          sx={{ bgcolor: "grey.200", position: "absolute", top: 5, left: 5 }}
          variant="rectangular"
          width={width * ratio - 10}
          height={height * ratio - 10}
        />
      )}
      <canvas
        style={{
          background: "white",
          cursor: "pointer",
          height: `${height * ratio}px`,
          width: `${width * ratio}px`,
        }}
        ref={cnvRef}
        onClick={() =>
          changeSelectedPage((prev) => {
            const temp = [...prev];
            temp.splice(selectedPdf, 1, pageNumber);
            return temp;
          })
        }
      />
    </Box>
  );
};

export default PreviewPdf;
