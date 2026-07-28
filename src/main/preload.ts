import { contextBridge, ipcRenderer } from "electron";
import { Card, Movie, Settings } from "../types/general";

contextBridge.exposeInMainWorld("directory", {
  getFolderPath: () => ipcRenderer.invoke("getFolderPath"),
  onGetMoviesFromDirectory: (functionToSaveData: (data: Movie[]) => void) =>
    ipcRenderer.on("on-get-movies", (_event, args) => {
      console.log("GOT MOVIES LIST FROM MAIN");
      functionToSaveData(args);
    }),
  saveNewFolderOnDB: (path: string) =>
    ipcRenderer.send("save_new_folder_on_db", path),
  onSaveFolderOnDB: (functionToSaveFolder: (path: string) => void) =>
    ipcRenderer.on("on_save_folder_on_db", (_event, args) => {
      console.log("got result from save folder operation", args);
      functionToSaveFolder(args);
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
