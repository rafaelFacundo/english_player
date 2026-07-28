import { Box, Typography } from "@mui/material";
import mockImage from "src/assets/mock_image.jpg";
import LinearProgress from "@mui/material/LinearProgress";
import PlayIcon from "../icons/PlayIcon";
import { Movie } from "src/types/general";
import React from "react";

type continueWatchingVideoOptionProps = {
  movie: Movie;
};

const ContinueWatchingVideoOption: React.FC<
  continueWatchingVideoOptionProps
> = ({ movie }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "338px",
        height: "185px",
        minWidth: "338px",
        minHeight: "185px",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={(theme) => ({
          width: "100%",
          height: "151px",
          backgroundImage: `url(${mockImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: theme.palette.backgroundColor.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": {
            width: "42px",
            height: "42px",
          },
        })}
      >
        <PlayIcon />
      </Box>

      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
          flexDirection: "column",
          backgroundColor: "#290F32",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#C516C8",
            width: "45%",
            height: "4px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></Box>
        <Typography sx={{ color: "white" }}>{movie.title}</Typography>
      </Box>
    </Box>
  );
};

export default ContinueWatchingVideoOption;
