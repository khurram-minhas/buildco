import { Box, BoxProps, styled, Typography } from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { Context } from "../Context";

import PreviewPdf from "./PreviewPdf";
type propTypes = {
  selectedPdf: number;
  selectedPage: number;
  changeSelectedPage: Dispatch<SetStateAction<number[]>>;
  pages: pdfjsLib.PDFPageProxy[];
  previewPages: HTMLImageElement[];
  changeLoading: Dispatch<SetStateAction<boolean>>;
  isGroupOpen: boolean;
};

const PreviewSection = ({
  selectedPdf,
  selectedPage,
  changeSelectedPage,
  pages,
  previewPages,
  changeLoading,
  isGroupOpen,
}: propTypes): JSX.Element => {
  const context = useContext(Context);

  return (
    <PreviewContainer navHeight={context.navHeight} isGroupOpen={isGroupOpen}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        {pages.map((page, order: number) => (
          <Box
            key={order}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "5px",
              margin: "20px",
            }}
          >
            <PreviewPdf
              height={page.getViewport({ scale: 1 }).height}
              width={page.getViewport({ scale: 1 }).width}
              ratio={Math.min(
                200 / page.getViewport({ scale: 1 }).height,
                200 / page.getViewport({ scale: 1 }).width
              )}
              page={page}
              previewPage={previewPages[order]}
              pageNumber={order}
              isSelectedPage={selectedPage === order}
              selectedPdf={selectedPdf}
              changeSelectedPage={changeSelectedPage}
            />
            <Typography fontSize="14px" sx={{ color: "#333333" }}>
              page {order + 1}
            </Typography>
          </Box>
        ))}
      </Box>
    </PreviewContainer>
  );
};

export default PreviewSection;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
  isGroupOpen: boolean;
}

const PreviewContainer = styled(Box)<CustomBoxProps>(
  ({ navHeight, isGroupOpen, theme }) => ({
    position: "fixed",
    top: "50px",
    left: isGroupOpen ? `calc(50% - 715px)` : `calc(50% - 515px)`,
    width: isGroupOpen ? "1430px" : "1030px",
    boxSizing: "border-box",
    backgroundColor: "white",
    borderRadius: "32px",
    boxShadow: "0px 1px 4px 0px gray",
    padding: "10px",
    paddingTop: "70px",
    paddingLeft: "30px",
    paddingRight: "30px",
    display: "flex",
    alignItems: "center",
    zIndex: 700,
  })
);
