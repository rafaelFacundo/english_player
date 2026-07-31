import React, { createContext, useEffect, useState } from "react";
import { Movie, MovieDuration, Settings, Subtitle } from "src/types/general";

export type AppState = {
  moviesData: Movie[];
  settingsData: Settings;
  currentMovieBeingWatched: string;
  isScanningFolder: boolean;
  subtitles: Subtitle[];
};

export type AppContextType = {
  state: AppState;
  setMoviesList: (moviesList: Movie[]) => void;
  setSettings: (newSettings: Settings) => void;
  setMoviesFolder: (path: string) => void;
  setSubtitleColor: (color: string) => void;
  setSubtitleBackgroundColor: (backgroundColor: string) => void;
  setCurrentMovie: (moviePath: string) => void;
  setIsScanningFolder: (value: boolean) => void;
  setSubtitlesList: (subtitlesList: Subtitle[]) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderPropsType = {
  children: React.ReactNode;
};

const initialState: AppState = {
  moviesData: [],
  settingsData: {
    subtitle_color: "FFFF00",
    subtitle_background_color: "000000",
    movies_directory_path: "",
  },
  currentMovieBeingWatched: "",
  isScanningFolder: false,
  subtitles: [],
};

const AppProvider: React.FC<AppProviderPropsType> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setMoviesList = (moviesList: Movie[]) => {
    setState((prevState) => ({ ...prevState, moviesData: moviesList }));
  };

  const setSubtitlesList = (subtitlesList: Subtitle[]) => {
    setState((prevState) => ({ ...prevState, subtitles: subtitlesList }));
  };

  const setSettings = (newSettings: Settings) => {
    setState((prevState) => ({ ...prevState, settingsData: newSettings }));
  };

  const setMoviesFolder = (path: string) => {
    if (path !== "") {
      setState((prevState) => ({
        ...prevState,
        settingsData: {
          ...prevState.settingsData,
          movies_directory_path: path,
        },
      }));
    }
  };

  const setSubtitleColor = (color: string) => {
    setState((prevState) => ({
      ...prevState,
      settingsData: {
        ...prevState.settingsData,
        subtitle_color: color,
      },
    }));
  };

  const setSubtitleBackgroundColor = (backgroundColor: string) => {
    setState((prevState) => ({
      ...prevState,
      settingsData: {
        ...prevState.settingsData,
        subtitle_background_color: backgroundColor,
      },
    }));
  };

  const setCurrentMovie = (moviePath: string) => {
    setState((prevState) => ({
      ...prevState,
      currentMovieBeingWatched: moviePath,
    }));
  };

  const setIsScanningFolder = (value: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isScanningFolder: value,
    }));
  };

  useEffect(() => {
    const scanForMovies = async () => {
      if (
        state.settingsData.movies_directory_path !== "" &&
        state.settingsData.movies_directory_path !== null
      ) {
        const foldersList = await window.directory.getDirectoryList();
        const path = state.settingsData.movies_directory_path;
        const folderAlreadySaved = foldersList.findIndex(
          (folder) => folder.path === state.settingsData.movies_directory_path
        );
        if (folderAlreadySaved === -1) {
          const saveFolderResult =
            await window.directory.saveNewFolderOnDB(path);

          const updateSettingsResult = await window.settings.saveSettingsData({
            key: "movies_directory_path",
            value: path,
          });
          if (updateSettingsResult && saveFolderResult) {
            window.movies.seachForMovies(
              state.settingsData.movies_directory_path
            );
          }
        }
      }
    };
    scanForMovies();
  }, [state.settingsData.movies_directory_path]);

  useEffect(() => {
    window.settings.getSettingsData();
    window.directory.onGetMoviesFromDirectory(setMoviesList);
    window.settings.onGetSettingsData(setSettings);
    window.movies.onGetSubtitles(setSubtitlesList);
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setMoviesList,
        setSettings,
        setMoviesFolder,
        setSubtitleColor,
        setSubtitleBackgroundColor,
        setCurrentMovie,
        setIsScanningFolder,
        setSubtitlesList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
