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
  setDeckName: (deckName: string) => void;
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
    setState((prevState) => {
      const newState = { ...prevState, moviesData: moviesList };
      console.log("SET MOVIES LIST STATE", newState);
      return newState;
    });
  };

  const setSettings = (newSettings: Settings) => {
    console.log("asdas", newSettings);
    const newState = { ...state };
    newState.settingsData = newSettings;
    setState(newState);
  };

  const setMoviesFolder = (path: string) => {
    const newState = { ...state };
    if (path !== "") {
      newState.settingsData.movies_directory_path = path;
      setState(newState);
      window.settings.saveSettingsData({
        key: "movies_directory_path",
        value: path,
      });
    }
  };

  const setSubtitleColor = (color: string) => {
    const newState = { ...state };
    newState.settingsData.subtitle_color = color;
    setState(newState);
  };

  const setSubtitleBackgroundColor = (backgroundColor: string) => {
    const newState = { ...state };
    newState.settingsData.subtitle_background_color = backgroundColor;
    setState(newState);
  };

  const setDeckName = (deckName: string) => {
    const newState = { ...state };
    setState(newState);
    window.settings.saveSettingsData(newState.settingsData);
  };

  const setCurrentMovie = (moviePath: number) => {
    const newState = { ...state };
    newState.currentMovieBeingWatched = moviePath;
    setState(newState);
  };

  const setIsScanningFolder = (value: boolean) => {
    const newState = { ...state };
    newState.isScanningFolder = value;
    setState(newState);
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
        setDeckName,
        setCurrentMovie,
        setIsScanningFolder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
