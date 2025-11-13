// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { Card, Movie, Settings } from "../types/general";

contextBridge.exposeInMainWorld("directory", {
  getFolderPath: () => ipcRenderer.invoke("getFolderPath"),
  onGetMoviesFromDirectory: (functionToSaveData: (data: Movie[]) => void) =>
    ipcRenderer.on("on-get-movies", (_event, args) => {
      console.log("GOT MOVIES LIST FROM MAIN");
      functionToSaveData(args);
    }),
});

contextBridge.exposeInMainWorld("movies", {
  seachForMovies: (path: string) => {
    ipcRenderer.send("searchForMovies", path);
  },
  refreshMoviesFolder: (path: string) => {
    ipcRenderer.send("refreshMoviesFolder", path);
  },
});

contextBridge.exposeInMainWorld("settings", {
  onGetSettingsData: (functionToSaveData: (data: Settings) => void) =>
    ipcRenderer.on("config_data_loaded", (_event, data) => {
      functionToSaveData(data);
    }),
  getSettingsData: () => ipcRenderer.send("get_settings_data"),
  saveSettingsData: (data: Settings) => {
    ipcRenderer.send("save_settings_data", data);
  },
});

contextBridge.exposeInMainWorld("deck", {
  saveCard: (data: Card) => {
    ipcRenderer.send("save_card", data);
  },
});
