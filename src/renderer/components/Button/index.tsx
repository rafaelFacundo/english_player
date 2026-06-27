import React from "react";
import "./index.css";
import { ButtonBase, SxProps, Theme } from "@mui/material";

type ButtonProps = {
  icon: React.ReactNode | string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
};

const Button: React.FC<ButtonProps> = ({ icon, onClick, sx }) => {
  return (
    <ButtonBase onClick={onClick} sx={sx}>
      {icon}
    </ButtonBase>
  );
};

export default Button;
