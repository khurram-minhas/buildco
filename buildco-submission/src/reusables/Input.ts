import Input, { InputProps } from "@mui/material/Input";
import { styled } from "@mui/material";

interface CustomInputProps extends InputProps {
  //   backgroundcolor?: string;
  //   hovercolor?: string;
}

const CustomInput = styled(Input)<CustomInputProps>(({ theme }) => ({}));

export default CustomInput;
