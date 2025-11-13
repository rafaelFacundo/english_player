import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { handleSubtitleProtocol } from "./protocol/subtitle";
import { handleImageProtocol } from "./protocol/image";
import { handleVideoProtocol } from "./protocol/video";
import { handleSaveCard } from "./ipc/cards";
import { handleRefreshMoviesFolder, handleSearchForMovies } from "./ipc/movies";
import {
  getConfig,
  handleExportSettingsData,
  register_GetFolderPath_And_SettingData_IpcHandlers,
} from "./ipc/settings";
import { verifyInitialSettingsFileAndMoviesData } from "./utils/general";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "video",
    privileges: {
      standard: true,
      secure: true,
      bypassCSP: true,
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true,
    },
  },
  {
    scheme: "subtitle",
    privileges: {
      standard: true,
      secure: true,
      bypassCSP: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

if (started) {
  app.quit();
}

const createWindow = async () => {
  await verifyInitialSettingsFileAndMoviesData();
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    title: "English player",
    autoHideMenuBar: true,
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  register_GetFolderPath_And_SettingData_IpcHandlers(mainWindow);
};

app.on("ready", () => {
  createWindow();
  protocol.handle("subtitle", handleSubtitleProtocol);
  protocol.handle("image", handleImageProtocol);
  protocol.handle("video", handleVideoProtocol);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("save_settings_data", handleExportSettingsData);
ipcMain.on("searchForMovies", handleSearchForMovies);
ipcMain.on("refreshMoviesFolder", handleRefreshMoviesFolder);
ipcMain.on("save_card", handleSaveCard);
ipcMain.on("get_settings_data", getConfig);
