import React from "react";

import { Box, styled, Typography } from "@mui/material";

const MobileWeb = (): JSX.Element => {

  return (
    <>
      <OverLay />
      <ModalContainer>
        <Title>Mobile support not available yet!</Title>
        <Description>
          Please open the web in desktop/laptop browser to use it properly!
        </Description>
      </ModalContainer>
    </>
  );
};

export default MobileWeb;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  top: "50%",
  left: "50%",
  height: "90%",
  maxHeight: "550px",
  width: "80%",
  maxWidth: "800px",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "40px",
  zIndex: 1000,
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  boxSizing: "border-box",
});

const Title = styled(Typography)({
  fontSize: "28px",
  lineHeight: "32px",
  fontWeight: "400",
  color: "#222222",
});

const Description = styled(Typography)({
  fontSize: "18px",
  lineHeight: "28px",
  fontWeight: "400",
  color: "#333030",
});

const UploadZone = styled(Box)({
  width: "100%",
  height: "250px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  border: "2px dashed #FFBC01",
  cursor: "pointer",
});
