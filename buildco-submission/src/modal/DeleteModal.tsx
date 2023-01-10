import { Box, styled, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import CustomButton from "../reusables/Button";

type propTypes = {
  onClose: () => void;
  onDelete: () => void;
  type: string;
};
const DeleteModal = ({ onClose, onDelete, type }: propTypes): JSX.Element => {
  const handleDelete = () => {
    onClose();
    onDelete();
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
          <WarningAmberIcon />
          <Typography fontWeight="500">Delete {type}?</Typography>
          <Typography fontWeight="500">This can't be undone</Typography>
          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={handleDelete}
              sx={{
                padding: "6px 8px",
                borderColor: "#FFBC01",
                ":hover": {
                  borderColor: "#FFBC01",
                },
              }}
            >
              Delete {type}
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="#FFBC01"
              hoverbackgroudcolor="#ffa700"
              onClick={onClose}
              sx={{
                padding: "6px 20px",
              }}
            >
              Cancel
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default DeleteModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1300,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 2100,
  borderRadius: "5px",
});
