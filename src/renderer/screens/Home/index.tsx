import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [showCarrousselArrows, setShowCarrousselArrows] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    const container = listContainerRef.current;
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        let moviesList: Element;
        let moviesListContainer: Element;
        entries.forEach((entry: ResizeObserverEntry) => {
          if (entry.target === list) {
            moviesList = entry.target;
          } else {
            moviesListContainer = entry.target;
          }
        });
        if (!moviesList || !moviesListContainer) return;
        const listRect = moviesList.getBoundingClientRect();
        const containerRect = moviesListContainer.getBoundingClientRect();
        if (listRect.width <= containerRect.width) {
          setShowCarrousselArrows(false);
        } else {
          setShowCarrousselArrows(true);
        }
      }
    );

    resizeObserver.observe(list);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(list);
      resizeObserver.unobserve(container);
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
        <Typography
          sx={{
            color: "white",
            fontSize: "48px",
            marginLeft: "47px",
            marginTop: "45px",
          }}
        >
          Continue watching
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            maxHeight: "fit-content",
            position: "relative",
            marginTop: "30px",
          }}
        >
          <Button
            icon={<LeftSideArrow />}
            sx={{
              position: "absolute",
              top: "50%",
              left: "0px",
              "& svg": {
                width: "62px",
                height: "62px",
              },
              transform: "translateY(-50%)",
              display: showCarrousselArrows ? "auto" : "none",
              zIndex: 5,
            }}
            onClick={() => {
              if (listContainerRef.current) {
                listContainerRef.current.scrollBy({
                  left: -400,
                  behavior: "smooth",
                });
              }
            }}
          />
          <Box
            sx={{
              display: "flex",
              overflowY: "hidden",
              overflowX: "auto",
              width: "100%",
              position: "relative",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            ref={listContainerRef}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "25px",
                flex: 1,
                //minWidth: "0px",
                paddingLeft: "70px",
                paddingRight: "70px",
                minWidth: "fit-content",
                overflowX: "hidden",
              }}
              ref={listRef}
            >
              <ContinueWatchingVideoOption />
              <ContinueWatchingVideoOption />
              <ContinueWatchingVideoOption />
            </Box>
          </Box>
          <Button
            icon={<RightSideArrow />}
            sx={{
              position: "absolute",
              top: "50%",
              right: "0px",
              "& svg": { width: "62px", height: "62px" },
              transform: "translateY(-50%)",
              display: showCarrousselArrows ? "auto" : "none",
              zIndex: 5,
            }}
            onClick={() => {
              if (listContainerRef.current) {
                listContainerRef.current.scrollBy({
                  left: 400,
                  behavior: "smooth",
                });
              }
            }}
          />
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
