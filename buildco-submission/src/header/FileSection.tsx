import { Box } from "@mui/material";
import { useContext } from "react";
import { Context } from "../Context";
import UploadFile from "../UploadFile";
import SelectFile from "./SelectFile";

type props = {
  onFileUpload: (files: FileList) => void;
  fileName: string[];
  pdfOrder: number[];
  changePdfOrder: React.Dispatch<React.SetStateAction<number[]>>;
  selectedPdf: number;
  changeSelectedPdf: React.Dispatch<React.SetStateAction<number>>;
};
const FileSection = ({
  onFileUpload,
  fileName,
  pdfOrder,
  changePdfOrder,
  selectedPdf,
  changeSelectedPdf,
}: props): JSX.Element => {
  const context = useContext(Context);
  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SelectFile
        fileName={fileName}
        pdfOrder={pdfOrder}
        changePdfOrder={changePdfOrder}
        selectedPdf={selectedPdf}
        changeSelectedPdf={changeSelectedPdf}
      />
      <UploadFile
        type={context.fileUploadType["primary"]}
        onFileUpload={onFileUpload}
      />
    </Box>
  );
};

export default FileSection;
