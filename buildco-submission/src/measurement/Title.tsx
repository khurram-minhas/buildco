import { Box, styled } from "@mui/material";
import { ReactComponent as Settings } from "../assets/icons/settingsHeight.svg";

const Title = (): JSX.Element => {
  return (
    <Container>
      <TitleField sx={{ width: "180.5px" }}>Name</TitleField>
      <TitleField sx={{ width: "90.5px" }}>Result</TitleField>
      <TitleField
        sx={{
          padding: "0px 10px",
          width: "40px",
        }}
      >
        <Settings fill="#c3c3ca" />
      </TitleField>
      <TitleField sx={{ width: "90px" }}>Total</TitleField>
      <TitleField sx={{ width: "60px" }} />
    </Container>
  );
};

export default Title;

const Container = styled(Box)({
  height: "35px",
  boxSizing: "border-box",
  width: "460px",
  backgroundColor: "#f4f4f4",
  borderLeft: "1px solid #d6dae5",
  borderTop: "1px solid #d6dae5",
  borderBottom: "1px solid #d6dae5",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});

const TitleField = styled(Box)({
  boxSizing: "border-box",
  height: "100%",
  paddingLeft: "10px",
  fontSize: "16px",
  lineHeight: "20px",
  fontWeight: "400",
  color: "#666666",
  borderRight: "1px solid #d6dae5",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});
