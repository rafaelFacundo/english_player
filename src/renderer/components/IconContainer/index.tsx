import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

type IconContainerProps = {
  children: React.ReactNode;
  iconWidth: number;
  iconHeight: number;
};

const IconContiner: React.FC<IconContainerProps> = ({
  children,
  iconWidth,
  iconHeight,
}) => {
  return (
    <Box
      sx={{
        width: "fit-content",
        height: "fit-content",
        margin: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
          width: `${iconWidth}px`,
          height: `${iconHeight}px`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default IconContiner;
