import { ButtonBase, Typography } from "@mui/material";
import React from "react";

type ButtonProps = {
  icon?: React.ReactNode | string;
  onClick?: () => void;
  text: string;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
};

const Button: React.FC<ButtonProps> = ({
  icon,
  onClick,
  text,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "402px",
        height: "87px",
        backgroundColor: "#290A2D",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        "& svg": {
          width: "28px",
          height: "28px",
        },
      }}
    >
      {icon}
      <Typography
        sx={{
          color: "white",
          fontSize: "28px",
        }}
      >
        {text}
      </Typography>
    </ButtonBase>
  );
};
export default Button;
