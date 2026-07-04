import { Box, Typography } from "@mui/material";

type IconAndTextProps = {
  icon: React.ReactNode | string;
  text: string;
};

const IconAndText: React.FC<IconAndTextProps> = ({ icon, text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        "& svg": {
          width: "25px",
          height: "25px",
        },
        gap: "10px",
      }}
    >
      {icon}
      <Typography
        sx={{
          color: "white",
          textWrap: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default IconAndText;
