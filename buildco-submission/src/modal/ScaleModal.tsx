import { Box, styled, Typography } from "@mui/material";
import { ReactComponent as ScaleIcon } from "../assets/icons/scale.svg";
import CustomButton from "../reusables/Button";

type propTypes = {
  onClose: () => void;
  onCancel: () => void;
};
const ScaleModal = ({ onClose, onCancel }: propTypes): JSX.Element => {
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
          <ScaleIcon style={{ height: "20px" }} />
          <Typography fontWeight="500">Find Page Scale</Typography>
          <Box
            sx={{
              marginTop: "30px",
              width: "85%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Typography fontSize="15px" fontWeight="420" lineHeight="14px">
              1. Measure a known length on the page. Longer is better for
              accuracy
            </Typography>
            <Typography fontSize="15px" fontWeight="420" lineHeight="14px">
              2. Click to start and click again to finish
            </Typography>
            <Typography fontSize="15px" fontWeight="420" lineHeight="14px">
              3. Input length according to plan to calibrate this page
            </Typography>
          </Box>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onCancel}
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
              onClick={onClose}
              sx={{
                padding: "6px 20px",
              }}
            >
              Find Scale
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default ScaleModal;

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
