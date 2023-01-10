import { Box, styled, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRef } from "react";
import CustomButton from "../reusables/Button";

type propTypes = {
  onClose: () => void;
  fileName: string[];
  pdfIndex: string;
};
const RenameModal = ({
  fileName,
  pdfIndex,
  onClose,
}: propTypes): JSX.Element => {
  const textRef = useRef<any>(null);

  const handleRename = () => {
    const text = textRef.current?.value as string;
    if (text.trim().length && text.trim().endsWith(".pdf")) {
      fileName[+pdfIndex] = text.trim();
      onClose();
    } else {
      alert("invalid name");
    }
  };

  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <EditIcon />
          <Typography fontWeight="500">Rename Plan</Typography>
          <Box
            sx={{
              marginTop: "30px",
              width: "95%",
              display: "flex",
              flexFlow: "column nowrap",
              alignItems: "flex-start",
            }}
          >
            <Typography fontSize={14}>PDF Name</Typography>
            <TextField
              fullWidth
              defaultValue={fileName[parseInt(pdfIndex)]}
              inputRef={textRef}
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                },
              }}
            />
          </Box>
          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: "6px 8px",
                borderColor: "#FFBC01",
                ":hover": {
                  borderColor: "#FFBC01",
                },
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="#FFBC01"
              hoverbackgroudcolor="#ffa700"
              onClick={handleRename}
            >
              Rename
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default RenameModal;

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
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});
