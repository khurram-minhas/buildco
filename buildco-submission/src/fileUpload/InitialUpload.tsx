import React, { useRef, useState, useEffect } from "react";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, styled, Typography } from "@mui/material";
import { makeid } from "../utils";
import { useNavigate } from "react-router-dom"

type props = {
  pdfId: string | null;
  onFileUpload: (files: FileList) => void;
};

const InitialUpload = ({ pdfId, onFileUpload }: props): JSX.Element => {
  const history = useNavigate()
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  useEffect(() => {
    if(!inputRef || !pdfId) {
      history(`/?id=${makeid(5)}`)
      return;
    }
    try {
      fetch(`http://localhost:8081/getPdf/${pdfId}`)
      .then(res => res.blob())
      .then(res => {
        if(res.size === 0)
          return null;
        console.log(res)
        let fileA = new File([res], `${pdfId}.pdf`)
        let list = new DataTransfer(); 
        list.items.add(fileA)
        console.log(fileA)
        setUploadedFiles(list.files)
        onFileUpload(list.files)
      })
    }
    catch(ex) {
      console.log(ex)
    }
  }, [inputRef, pdfId])

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropZoneRef.current!.style.border = "2px solid #FFBC01";
    dropZoneRef.current!.style.boxShadow = "0px 0px 100px 0px #ffbc0140 inset";
  };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropZoneRef.current!.style.border = "2px dashed #FFBC01";
    dropZoneRef.current!.style.boxShadow = "none";
  };
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(event.target.files);
    }
  };
  const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setUploadedFiles(undefined);
    if (files.length !== 1 || files[0].type !== "application/pdf") {
      dropZoneRef.current!.style.border = "2px solid #ca2121";
      dropZoneRef.current!.style.boxShadow = "0px 0px 10px 0px red inset";
      return;
    }
    dropZoneRef.current!.style.border = "2px dashed #FFBC01";
    dropZoneRef.current!.style.boxShadow = "none";
    setUploadedFiles(files);
  };

  return (
    <>
      <OverLay />
      <ModalContainer>
        <Title>Create a Takeoff</Title>
        <Description>
          To create a new takeoff, please upload project plans here
        </Description>
        <UploadZone
          ref={dropZoneRef}
          onClick={() => inputRef.current?.click()}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDrop={dropHandler}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "20px",
              fontWeight: "400",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#4499e6",
              }}
            >
              <CloudUploadIcon sx={{ color: "#FFBC01" }} />
              <Typography
                sx={{ fontSize: "20px", fontWeight: "400", color: "#FFBC01" }}
              >
                Upload
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "20px", fontWeight: "400" }}>
              or drag and drop your plans here
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              color: "#1e1c1c80",
            }}
          >
            We only accept PDf format
          </Typography>
          <input
            type="file"
            onChange={changeHandler}
            ref={inputRef}
            hidden
            accept="application/pdf"
          />
        </UploadZone>
        <Box
          sx={{
            height: "50px",
            width: "100%",
            display: "flex",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {uploadedFiles?.length === 1 && (
            <>
              <Typography
                sx={{
                  color: "#333030",
                  fontSize: "14px",
                }}
              >
                {uploadedFiles[0].name}
              </Typography>
              <IconButton
                onClick={() => setUploadedFiles(undefined)}
                sx={{ width: "30px", height: "30px" }}
              >
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: "#333030",
                  }}
                />
              </IconButton>
            </>
          )}
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Button
            variant="contained"
            disabled={uploadedFiles?.length !== 1}
            sx={{
              height: "45px",
              backgroundColor: "#FFBC01",
              ":hover": {
                backgroundColor: "#FFBC01",
              },
            }}
            onClick={() => {
              if (uploadedFiles !== undefined) onFileUpload(uploadedFiles);
            }}
          >
            Create & Continue
          </Button>
        </Box>
      </ModalContainer>
    </>
  );
};

export default InitialUpload;

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
  justifyContent: "flex-start",
  alignItems: "flex-start",
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
