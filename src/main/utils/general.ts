import fs from "node:fs";
import {
  configJsonFilePath,
  moviesFoldersPath,
  moviesIndexFIlePath,
  applicationMoviesThumbsPath,
} from "src/main/utils/paths";
import { configFileInitialValue } from "src/main/filesInitialValue/config";
import { createAfile, createDirSync } from "src/main/utils/files";

export const verifyInitialSettingsFileAndMoviesData = async () => {
  /* if (!fs.existsSync(applicationMoviesThumbsPath)) {
    createDirSync(applicationMoviesThumbsPath);
  } */
};
