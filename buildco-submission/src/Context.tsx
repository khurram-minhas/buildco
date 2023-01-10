import { useMediaQuery, useTheme } from "@mui/material";
import { createContext, ReactNode, useEffect, useState } from "react";

enum navHeightValue {
  smallDevice = "50px",
  largeDevice = "70px",
}
enum fileUploadTypeOptions {
  primary = "primary",
  secondary = "secondary",
}

type ContextType = {
  navHeight: string;
  fileUploadType: typeof fileUploadTypeOptions;
};

export const Context = createContext<ContextType>({
  navHeight: "",
  fileUploadType: fileUploadTypeOptions,
});

type props = {
  children: ReactNode;
};

const ContextProvider = ({ children }: props): JSX.Element => {
  const theme = useTheme();
  const isLargeDevice = useMediaQuery(theme.breakpoints.up("sm"));
  const [navHeight, setNavHeight] = useState<navHeightValue>(
    navHeightValue.largeDevice
  );


  useEffect(() => {
    if (isLargeDevice) setNavHeight(navHeightValue.largeDevice);
    else setNavHeight(navHeightValue.smallDevice);
  }, [isLargeDevice]);

  return (
    <Context.Provider
      value={{
        navHeight,
        fileUploadType: fileUploadTypeOptions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
