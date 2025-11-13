import React, { createContext, useEffect, useState } from "react";
import { Movie, MovieDuration, Settings } from "src/types/general";

export type AppState = {
  moviesData: Movie[];
  settingsData: Settings;
  currentMovieBeingWatched: number;
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
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderPropsType = {
  children: React.ReactNode;
};

const initialState: AppState = {
  moviesData: [],
  settingsData: {
    subtitleColor: "FFFF00",
    subtitleBackgroundColor: "000000",
    deckName: "",
    moviesDirectoryPath: "",
  },
  currentMovieBeingWatched: -1,
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
    const newState = { ...state };
    newState.settingsData = newSettings;
    setState(newState);
  };

  const setMoviesFolder = (path: string) => {
    const newState = { ...state };
    if (path !== "") {
      console.log("enter");
      newState.settingsData.moviesDirectoryPath = path;
    }
    setState(newState);
    window.settings.saveSettingsData(newState.settingsData);
  };

  const setSubtitleColor = (color: string) => {
    const newState = { ...state };
    newState.settingsData.subtitleColor = color;
    setState(newState);
  };

  const setSubtitleBackgroundColor = (backgroundColor: string) => {
    const newState = { ...state };
    newState.settingsData.subtitleBackgroundColor = backgroundColor;
    setState(newState);
  };

  const setDeckName = (deckName: string) => {
    const newState = { ...state };
    newState.settingsData.deckName = deckName;
    setState(newState);
    window.settings.saveSettingsData(newState.settingsData);
  };

  const setCurrentMovie = (moviePath: number) => {
    const newState = { ...state };
    newState.currentMovieBeingWatched = moviePath;
    setState(newState);
  };

  useEffect(() => {
    if (state.settingsData.moviesDirectoryPath !== "") {
      window.movies.seachForMovies(state.settingsData.moviesDirectoryPath);
    }
  }, [state.settingsData.moviesDirectoryPath]);

  useEffect(() => {
    window.settings.getSettingsData();
    window.directory.onGetMoviesFromDirectory(setMoviesList);
    window.settings.onGetSettingsData(setSettings);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
