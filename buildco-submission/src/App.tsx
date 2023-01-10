import { ThemeProvider } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import ContextProvider from "./Context";
import Homepage from "./Homepage";
import defaultTheme from "./Theme";

function App() {
  return <ThemeProvider theme={defaultTheme}>
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  </ThemeProvider>;
}

export default App;
