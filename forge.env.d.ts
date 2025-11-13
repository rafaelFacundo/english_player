/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
/// <reference types="vite/client" />

import { Movie } from "./src/types/general";
export {};

declare module "*.png";

declare global {
  interface Window {
    directory: {
      getFolderPath: () => string;
      onGetMoviesFromDirectory: (
        functionToSaveData: (data: Movie[]) => void
      ) => void;
    };
    movies: {
      seachForMovies: (path: string) => void;
      refreshMoviesFolder: (path: string) => void;
    };
    settings: {
      onGetSettingsData: (unctionToSaveData: (data: Settings) => void) => void;
      getSettingsData: () => void;
      saveSettingsData: (data: Settings) => void;
    };
    deck: {
      saveCard: (data: Card) => void;
    };
  }
}
