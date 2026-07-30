import React, { createContext, useEffect, useState } from "react";
import { Movie, MovieDuration, Settings } from "src/types/general";

export type AppState = {
  moviesData: Movie[];
  settingsData: Settings;
  currentMovieBeingWatched: number /* to do (change) */;
  isScanningFolder: boolean;
};

export type AppContextType = {
  state: AppState;
  setMoviesList: (moviesList: Movie[]) => void;
  setSettings: (newSettings: Settings) => void;
  setMoviesFolder: (path: string) => void;
  setSubtitleColor: (color: string) => void;
  setSubtitleBackgroundColor: (backgroundColor: string) => void;
  setCurrentMovie: (moviePath: number) => void;
  setIsScanningFolder: (value: boolean) => void;
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
  currentMovieBeingWatched: -1,
  isScanningFolder: false,
};

const AppProvider: React.FC<AppProviderPropsType> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setMoviesList = (moviesList: Movie[]) => {
    setState((prevState) => ({ ...prevState, moviesData: moviesList }));
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
      window.settings.saveSettingsData({
        key: "movies_directory_path",
        value: path,
      });
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

  const setCurrentMovie = (moviePath: number) => {
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
    if (
      state.settingsData.movies_directory_path !== "" &&
      state.settingsData.movies_directory_path !== null
    ) {
      window.movies.seachForMovies(state.settingsData.movies_directory_path);
    }
  }, [state.settingsData.movies_directory_path]);

  useEffect(() => {
    window.settings.getSettingsData();
    window.directory.onGetMoviesFromDirectory(setMoviesList);
    window.settings.onGetSettingsData(setSettings);
    window.directory.onSaveFolderOnDB(setMoviesFolder);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
