/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
/// <reference types="vite/client" />

import { Folder, Movie, Subtitle } from "./src/types/general";
export {};

declare module "*.png";

declare global {
  interface Window {
    directory: {
      getFolderPath: () => string;
      onGetMoviesFromDirectory: (
        functionToSaveData: (data: Movie[]) => void
      ) => void;
      saveNewFolderOnDB: (path: string) => boolean;
      onSaveFolderOnDB: (functionToSaveFolder: (path: string) => void) => void;
      getDirectoryList: () => Folder[];
    };
    movies: {
      seachForMovies: (path: string) => void;
      refreshMoviesFolder: (path: string) => void;
      getSubtitles: () => void;
      onGetSubtitles: (
        functionToSaveSubtitles: (subtitlesList: Subtitle[]) => void
      ) => void;
    };
    settings: {
      onGetSettingsData: (unctionToSaveData: (data: Settings) => void) => void;
      getSettingsData: () => void;
      saveSettingsData: (data: Settings) => boolean;
    };
    deck: {
      saveCard: (data: Card) => void;
    };
  }
}
