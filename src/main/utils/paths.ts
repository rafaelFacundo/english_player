import { app } from "electron";
import path from "node:path";

export const userData = app.getPath("userData");
export const configJsonFilePath = path.join(userData, "config.json");
export const moviesFoldersPath = path.join(userData, "movies_folder");
export const moviesIndexFIlePath = path.join(
  moviesFoldersPath,
  "movies_index.json"
);
