import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from "electron";
import { Settings } from "src/types/general";
import { createAfile } from "src/main/utils/files";
import { configJsonFilePath } from "src/main/utils/paths";
import path from "node:path";
import fs from "node:fs";
import { getSettings } from "../db";

export const handleExportSettingsData = async (
  event: IpcMainEvent,
  data: Settings
) => {
  const fileContent = JSON.stringify(data);
  console.log("alskdjalskdjalskdjlk", data);
  await createAfile(
    configJsonFilePath,
    fileContent,
    () => {
      console.log("FILE CREATED at", configJsonFilePath);
    },
    () => {
      console.log("FILE DID NOT CREAT");
    }
  );
};

export const getConfig = (event: IpcMainEvent, _: any) => {
  const settingsObject: Settings = {
    movies_directory_path: "",
    subtitle_background_color: "",
    subtitle_color: "",
  };

  const result = getSettings();
  result.forEach((item) => {
    const key = item.key;
    settingsObject[key] = item.value;
  });

  event.reply("config_data_loaded", settingsObject);
};

export const register_GetFolderPath_And_SettingData_IpcHandlers = (
  mainWindow: BrowserWindow
) => {
  ipcMain.handle("getFolderPath", async () => {
    let returnValue = "";
    const response: Electron.OpenDialogReturnValue =
      await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
      });
    if (!response.canceled) {
      returnValue = response.filePaths[0];
    }
    return returnValue;
  });
};
