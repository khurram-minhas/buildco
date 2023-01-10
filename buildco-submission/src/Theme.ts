import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  color: {
    primary: "#333333",
    secondary: "#666666",
    navbar: "white",
    button: "white",
    buttonHover: "#f4f3f3",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true,
      },
    },
  },
});

export default defaultTheme;
