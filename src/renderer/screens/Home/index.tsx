import React, { useContext, useEffect, useRef } from "react";
import VideoOption from "src/renderer/components/videoOption";
import { AppContext } from "src/renderer/context/AppContext";

import { Box, Typography } from "@mui/material";
import SideBar from "src/renderer/components/sideBar";
import ContinueWatchingVideoOption from "src/renderer/components/ContinueWatchingVideoOption";
import Button from "src/renderer/components/Button";
import LeftSideArrow from "src/renderer/components/icons/LeftSideArrow";
import RightSideArrow from "src/renderer/components/icons/RightSideArrow";

const Home: React.FC = () => {
  const { state } = useContext(AppContext);
  const listOfMovies = state.moviesData;
  const listRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        const entry1 = entries[0];
        const entry2 = entries[1];
      }
    );

    resizeObserver.observe(listRef.current);
    resizeObserver.observe(listContainerRef.current);

    return () => {
      resizeObserver.unobserve(listRef.current);
      resizeObserver.unobserve(listContainerRef.current);
    };
  }, []);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          flex: 1,
          width: "5px",
        }}
      >
        <Box
          sx={{
            paddingTop: "45px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "25px",
            width: "100%",
          }}
        >
          <Typography
            sx={{ color: "white", fontSize: "48px", marginLeft: "47px" }}
          >
            Continue watching
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflow: "hidden",
              width: "100%",
              position: "relative",
            }}
            ref={listContainerRef}
          >
            <Button
              icon={<LeftSideArrow />}
              sx={{
                position: "absolute",
                top: "50%",
                lef: "0px",
                "& svg": {
                  width: "62px",
                  height: "62px",
                },
                transform: "translateY(-50%)",
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "25px",
                flex: 1,
                minWidth: "0px",
                paddingLeft: "60px",
                paddingRight: "60px",
                maxWidth: "fit-content",
              }}
              ref={listRef}
            >
              <ContinueWatchingVideoOption />
              <ContinueWatchingVideoOption />
              <ContinueWatchingVideoOption />
            </Box>
            <Button
              icon={<RightSideArrow />}
              sx={{
                position: "absolute",
                top: "50%",
                right: "0px",
                "& svg": { width: "62px", height: "62px" },
                transform: "translateY(-50%)",
              }}
            />
          </Box>
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
