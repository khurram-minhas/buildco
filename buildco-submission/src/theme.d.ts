import React from "react";

declare module "@mui/material/styles" {
  interface Theme {
    color: {
      primary: string;
      secondary: string;
      navbar: string;
      button: string;
      buttonHover: string;
    };
  }
  interface ThemeOptions {
    color: {
      primary: React.CSSProperties["color"];
      secondary: React.CSSProperties["color"];
      navbar: React.CSSProperties["color"];
      button: React.CSSProperties["color"];
      buttonHover: React.CSSProperties["color"];
    };
  }
}
