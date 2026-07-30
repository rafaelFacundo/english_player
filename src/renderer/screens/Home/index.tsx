import React, { useContext, useEffect, useRef, useState } from "react";
import VideoOption from "src/renderer/components/videoOption";
import { AppContext } from "src/renderer/context/AppContext";

import { Box, Typography } from "@mui/material";
import SideBar from "src/renderer/components/sideBar";
import ContinueWatchingVideoOption from "src/renderer/components/ContinueWatchingVideoOption";
import IconButton from "src/renderer/components/IconButton";
import LeftSideArrow from "src/renderer/components/icons/LeftSideArrow";
import RightSideArrow from "src/renderer/components/icons/RightSideArrow";
import IconContiner from "src/renderer/components/IconContainer";
import NoFilesIcon from "src/renderer/components/icons/NoFilesIcon";
import Button from "src/renderer/components/Button";
import ScanningMoviesIcon from "src/renderer/components/icons/ScanningMoviesIcon";
import { Movie } from "src/types/general";

const Home: React.FC = () => {
  const { state, setIsScanningFolder } = useContext(AppContext);
  const listOfMovies = state.moviesData;
  const isScanningMovies = state.isScanningFolder;
  const moviesFolderPath = state.settingsData.movies_directory_path;
  const listRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [showCarrousselArrows, setShowCarrousselArrows] = useState(false);
  const [disableCardAnimation, setDisableCardAnimation] = useState(false);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<Movie[]>(
    []
  );
  const [allMoviesList, setAllMoviesList] = useState<Movie[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const container = listContainerRef.current;
    console.log(list, container);
    if (list && container) {
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
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          const containerWidth =
            entries[0].target.getBoundingClientRect().width;
          if (containerWidth <= 1400) {
            setDisableCardAnimation(true);
          } else {
            setDisableCardAnimation(false);
          }
        }
      );

      resizeObserver.observe(container);

      return () => {
        resizeObserver.unobserve(container);
      };
    }
  }, []);

  const handleSelectFolder = async () => {
    const folderSelected = await window.directory.getFolderPath();
    if (folderSelected) {
      window.directory.saveNewFolderOnDB(folderSelected);
      setIsScanningFolder(true);
    }
  };

  useEffect(() => {
    if (listOfMovies.length > 0) {
      setAllMoviesList(listOfMovies);
      const watchingMovies = listOfMovies.filter(
        (element) => element.watched > 0
      );
      setContinueWatchingMovies(watchingMovies);
      setIsScanningFolder(false);
    }
  }, [listOfMovies]);

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.dark,
        backgroundImage: `linear-gradient(to top right, ${theme.palette.backgroundColor.main}, ${theme.palette.primary.dark})`,
        width: "100%",
        height: "100%",
        display: "flex",
      })}
      ref={containerRef}
    >
      <SideBar />
      {isScanningMovies ||
      moviesFolderPath === "" ||
      listOfMovies.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
            width: "5px",
            height: "100%",
          }}
        >
          <IconContiner iconHeight={190} iconWidth={190}>
            {isScanningMovies ? <ScanningMoviesIcon /> : <NoFilesIcon />}
          </IconContiner>
          {isScanningMovies ? (
            <>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "48px",
                  marginBottom: "45px",
                }}
              >
                Scanning movies folder....
              </Typography>
            </>
          ) : moviesFolderPath === null ? (
            <>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "48px",
                  marginBottom: "45px",
                }}
              >
                There is no selected movies folder
              </Typography>
              <Button text="Select folder" onClick={handleSelectFolder} />
            </>
          ) : (
            <>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "48px",
                  marginBottom: "45px",
                }}
              >
                There is no movie on the selected folder
              </Typography>
              <Button text="Refresh" marginBottom={28} />
              <Button
                text="Select another folder"
                onClick={handleSelectFolder}
              />
            </>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            flex: 1,
            width: "5px",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {continueWatchingMovies.length > 0 && (
            <>
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
                <IconButton
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
                      paddingLeft: "70px",
                      paddingRight: "70px",
                      minWidth: "fit-content",
                      overflowX: "hidden",
                    }}
                    ref={listRef}
                  >
                    {continueWatchingMovies.map((movie) => (
                      <ContinueWatchingVideoOption movie={movie} />
                    ))}
                  </Box>
                </Box>
                <IconButton
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
            </>
          )}

          <Box sx={{ paddingTop: "45px" }}>
            <Typography
              sx={{
                color: "white",
                fontSize: "48px",
                marginLeft: "47px",
                marginTop: "45px",
              }}
            >
              All videos
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                gap: "20px",
                paddingLeft: "70px",
                paddingRight: "70px",
                paddingTop: "20px",
                transition: "1s all ease-out",
              }}
            >
              {allMoviesList.map((movie) => (
                <VideoOption
                  disableAnimation={disableCardAnimation}
                  movie={movie}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
