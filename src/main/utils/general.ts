import fs from "node:fs";
import {
  configJsonFilePath,
  moviesFoldersPath,
  moviesIndexFIlePath,
  applicationMoviesThumbsPath,
} from "src/main/utils/paths";
import { configFileInitialValue } from "src/main/filesInitialValue/config";
import { createAfile, createDirSync } from "src/main/utils/files";
import { getSettings, insertKeySetting } from "../db";

export const verifyInitialSettings = async () => {
  try {
    if (!fs.existsSync(applicationMoviesThumbsPath)) {
      createDirSync(applicationMoviesThumbsPath);
    }
    const settingsList = getSettings();
    if (settingsList.length > 0) {
    } else {
      insertKeySetting([
        { key: "subtitle_color", value: "FFFFe0" },
        { key: "subtitle_background_color", value: "000000" },
        { key: "movies_directory_path", value: null },
      ]);
    }
  } catch (error) {
    console.log("ERROR WHILE CREATING INITIAL RESOURCES");
    console.log(error);
  }
};
