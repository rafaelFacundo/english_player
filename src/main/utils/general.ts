import fs from "node:fs";
import {
  configJsonFilePath,
  moviesFoldersPath,
  moviesIndexFIlePath,
} from "src/main/utils/paths";
import { configFileInitialValue } from "src/main/filesInitialValue/config";
import { createAfile, createDirSync } from "src/main/utils/files";

export const verifyInitialSettingsFileAndMoviesData = async () => {
  if (!fs.existsSync(configJsonFilePath)) {
    const fileContent = JSON.stringify(configFileInitialValue);
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
  }

  if (!fs.existsSync(moviesFoldersPath)) {
    createDirSync(moviesFoldersPath);
    await createAfile(
      moviesIndexFIlePath,
      JSON.stringify({}),
      () => {
        console.log("FILE CREATED at", moviesIndexFIlePath);
      },
      () => {
        console.log("FILE DID NOT CREAT");
      }
    );
  }
};
