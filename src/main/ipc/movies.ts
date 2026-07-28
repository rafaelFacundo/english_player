import fs, { Dirent, readdirSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { IpcMainEvent } from "electron";
import { File, FileType, Movie, Subtitle } from "src/types/general";
import {
  createAfile,
  createDirSync,
  readFileAsync,
} from "src/main/utils/files";
import { execSync } from "node:child_process";
import {
  applicationMoviesThumbsPath,
  moviesFoldersPath,
  moviesIndexFIlePath,
} from "src/main/utils/paths";
import {
  getFolderId,
  getMovies,
  insertNewFolder,
  insertNewMovies,
  insertNewSubtitles,
} from "../db";

const getFileExtension = (data: Dirent): string => {
  return path.extname(path.join(data.parentPath, data.name));
};

const getMovieStats = (
  moviePath: string
): { size: number; lastModified: Date; lasOpened: Date } | undefined => {
  let result:
    | { size: number; lastModified: Date; lasOpened: Date }
    | undefined = undefined;
  fs.stat(moviePath, (err, stats) => {
    if (err) {
      console.log("ERROR WHILE GETTING MOVIE STATS");
      return;
    }
    result = {
      size: stats.size,
      lastModified: stats.mtime,
      lasOpened: stats.atime,
    };
  });
  return result;
};

const getMovieDuration = (videoPath: string): number => {
  try {
    const stdout = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoPath}`
    ).toString();
    return Math.round(Number(stdout)) / 60;
  } catch (error) {
    console.log(`ERROR WHILE TRY TO GET DURATION FROM ${videoPath}`);
    console.log(error);
  }
};

const getMovieThumb = (videoPath: string, videoName: string): string => {
  try {
    const videoNameHash = crypto.hash("sha256", videoName);
    const thumbImagePath = `${applicationMoviesThumbsPath}/${videoNameHash}.jpg`;
    execSync(
      `ffmpeg -v error -ss 00:10:10 -i ${videoPath} -frames:v 1 -q:v 2 ${thumbImagePath}`
    );
    return thumbImagePath;
  } catch (error) {
    console.log(`ERROR WHILE TRYING TO EXTRACT THUMB FROM ${videoPath}`);
    console.log(error);
  }
};

const getSubtitleInfo = (
  item: fs.Dirent<string>,
  folderId: number | bigint
): Subtitle => {
  const subtitleFile: Subtitle = {
    path: path.join(item.parentPath, item.name),
    folderId: folderId,
    type: FileType.Subtitle,
  };
  return subtitleFile;
};

const getMovieInfo = (
  item: fs.Dirent<string>,
  folderId: number | bigint
): Movie => {
  const moviePath = path.join(item.parentPath, item.name);
  /* This object is going to be used to insert the movie on the dataBase */
  /*
    to insert, we don't need id, and subtitlesPath, therefore 
    i don't add these keys here 
  */
  const movie: Movie = {
    title: "",
    duration: 0,
    watched: 0,
    lastOpened: new Date(),
    numberOfCards: 0,
    lastModified: new Date(),
    size: 0,
    folderId: folderId,
    thumbPath: "",
    path: moviePath,
    type: FileType.Movie,
  };
  movie.thumbPath = getMovieThumb(moviePath, item.name);
  movie.duration = getMovieDuration(moviePath);
  const movieStats = getMovieStats(moviePath);
  if (movieStats) {
    movie.size = movieStats.size;
    movie.lastModified = movieStats.lastModified;
    movie.lastOpened = movieStats.lasOpened;
  }
  movie.title = item.name;
  return movie;
};

const handleStackItem = (
  item: fs.Dirent<string>,
  folderId: number | bigint
): File | undefined => {
  const fileExtension = getFileExtension(item);
  if (fileExtension === ".mp4") {
    return getMovieInfo(item, folderId);
  } else if (fileExtension === ".srt") {
    return getSubtitleInfo(item, folderId);
  }
};

const seekFiles = (pathToSearch: string, folderId: number | bigint): File[] => {
  let files: File[] = [];
  const filesStack: fs.Dirent<string>[] = fs.readdirSync(pathToSearch, {
    withFileTypes: true,
  });
  let stackItem: fs.Dirent<string>;
  while (filesStack.length > 0) {
    stackItem = filesStack[filesStack.length - 1];
    if (stackItem.isDirectory()) {
      const newDirectoryFiles = fs.readdirSync(
        path.join(pathToSearch, stackItem.name),
        { withFileTypes: true }
      );
      filesStack.pop();
      filesStack.push(...newDirectoryFiles);
    } else {
      files.push(handleStackItem(stackItem, folderId));
      filesStack.pop();
    }
  }
  return files;
};

export const handleSearchForMovies = async (
  event: IpcMainEvent,
  folderPath: string
) => {
  const newFolderId = getFolderId(folderPath);
  const files = seekFiles(folderPath, newFolderId);
  const movies: Movie[] = [];
  const subtitles: Subtitle[] = [];
  files.forEach((file) => {
    if (file.type === FileType.Movie) {
      movies.push(file as Movie);
    } else {
      subtitles.push(file as Subtitle);
    }
  });
  await insertNewMovies(movies);
  await insertNewSubtitles(subtitles);
  event.reply("on-get-movies", movies);
};

export const handleRefreshMoviesFolder = async (
  event: IpcMainEvent,
  folderPath: string
) => {
  const pathHash = crypto.hash("sha256", folderPath);
  const moviesIndexFile = JSON.parse(
    fs.readFileSync(moviesIndexFIlePath, {
      encoding: "utf8",
      flag: "r",
    })
  );
  if (moviesIndexFile[pathHash]) {
  }
};

export const handleSaveNewFolder = async (
  event: IpcMainEvent,
  folderPath: string
) => {
  try {
    const newFolderId = insertNewFolder({
      path: folderPath,
      lastScan: new Date(),
    });
    if (newFolderId) {
      event.reply("on_save_folder_on_db", folderPath);
    } else {
      event.reply("on_save_folder_on_db", folderPath);
    }
  } catch (error) {
    console.log("ERROR WHILE SAVING NEW FOLDER");
    console.log(error);
  }
};
