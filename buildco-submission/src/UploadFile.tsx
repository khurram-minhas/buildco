import React, { useEffect, useRef } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";

import CustomButton from "./reusables/Button";
import { Typography } from "@mui/material";

type props = {
  onFileUpload: (files: FileList) => void;
  type: string;
};
const UploadFile = ({ onFileUpload, type }: props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFileUpload(event.target.files);
  };
  return (
    <>
      <input
        type="file"
        onChange={changeHandler}
        ref={inputRef}
        hidden
        accept="application/pdf"
        multiple
      />
      <CustomButton
        onClick={() => inputRef.current?.click()}
        startIcon={<FileUploadIcon />}
        sx={{
          span: {
            margin: "1px",
            svg: {
              fontSize: "16px !important",
            },
          },
        }}
      >
        <Typography fontSize="12px">upload</Typography>
      </CustomButton>
    </>
  );
};

export default UploadFile;
