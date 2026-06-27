import React, { useContext } from "react";
import VideoOption from "src/renderer/components/videoOption";
import { AppContext } from "src/renderer/context/AppContext";

import { Box, Typography } from "@mui/material";
import SideBar from "src/renderer/components/sideBar";

const Home: React.FC = () => {
  const { state } = useContext(AppContext);
  const listOfMovies = state.moviesData;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.dark,
        backgroundImage: `linear-gradient(to top right, ${theme.palette.backgroundColor.main}, ${theme.palette.primary.dark})`,
        width: "100%",
        height: "100%",
        display: "flex",
      })}
    >
      <SideBar />
      <Box sx={{ paddingRight: "47px", paddingLeft: "47px" }}>
        <Box sx={{ paddingTop: "45px" }}>
          <Typography sx={{ color: "white", fontSize: "48px" }}>
            Continue watching
          </Typography>
        </Box>
        <Box sx={{ paddingTop: "45px" }}>
          <Typography sx={{ color: "white", fontSize: "48px" }}>
            All videos
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
