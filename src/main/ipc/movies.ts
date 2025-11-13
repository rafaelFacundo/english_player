import fs, { Dirent, readdirSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { IpcMainEvent } from "electron";
import { Movie } from "src/types/general";
import {
  createAfile,
  createDirSync,
  readFileAsync,
} from "src/main/utils/files";
import { execSync } from "node:child_process";
import { moviesFoldersPath, moviesIndexFIlePath } from "src/main/utils/paths";

const getFileExtension = (data: Dirent): string => {
  return path.extname(path.join(data.parentPath, data.name));
};

const getMovieDuration = (data: Dirent): number => {
  const videoPath = path.join(data.parentPath, data.name);
  const stdout = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoPath}`
  ).toString();
  return Math.round(Number(stdout)) / 60;
};

const extractMovieThumb = (
  data: Dirent,
  newPath: string,
  index: number
): string => {
  const thumbsPath = path.join(newPath, "thumbs");
  const videoPath = path.join(data.parentPath, data.name);
  const thumbImagePath = `${thumbsPath}/${index}.jpg`;
  execSync(
    `ffmpeg -v error -ss 00:10:10 -i ${videoPath} -frames:v 1 -q:v 2 ${thumbImagePath}`
  );
  return thumbImagePath;
};

const seekFiles = (
  pathToSearch: string,
  currentId: number,
  newPath: string
): Movie[] => {
  let movies: Movie[] = [];
  const dirFiles = fs.readdirSync(pathToSearch, { withFileTypes: true });
  const movieT: Movie = {
    duration: 0,
    id: -1,
    path: "",
    subtitlesPath: "",
    thumbPath: "",
    title: "",
  };
  for (const data of dirFiles) {
    if (data.isDirectory()) {
      const listResult = seekFiles(
        path.join(pathToSearch, data.name),
        currentId,
        newPath
      );
      movies = movies.concat(listResult);
      currentId += listResult.length;
    } else {
      const FileExtension = getFileExtension(data);
      if (FileExtension === ".mp4") {
        movieT.id = currentId;
        movieT.title = data.name;
        movieT.path = path.join(data.parentPath, data.name);
        movieT.duration = getMovieDuration(data);
        movieT.thumbPath = extractMovieThumb(data, newPath, currentId);
      } else if (FileExtension === ".srt") {
        movieT.subtitlesPath = path.join(data.parentPath, data.name);
      }
    }
  }
  if (movieT.id !== -1) {
    movies.push(movieT);
  }
  return movies;
};

export const handleSearchForMovies = async (
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
  if (!moviesIndexFile[pathHash]) {
    let movies: Movie[] = [];
    moviesIndexFile[pathHash] = folderPath;
    const newMovieFolderPath = path.join(moviesFoldersPath, pathHash);
    const thumbsPath = path.join(newMovieFolderPath, "thumbs");
    const moviesJsonFilePath = path.join(newMovieFolderPath, "movies.json");
    createDirSync(newMovieFolderPath);
    createDirSync(thumbsPath);
    await createAfile(
      moviesIndexFIlePath,
      JSON.stringify(moviesIndexFile),
      () => {},
      () => {}
    );
    movies = movies.concat(seekFiles(folderPath, 0, newMovieFolderPath));
    createAfile(
      moviesJsonFilePath,
      JSON.stringify(movies),
      () => {
        console.log("movies savved on ", moviesJsonFilePath);
        event.reply("on-get-movies", movies);
      },
      () => {
        console.log("can not create movies.json file");
      }
    );
  } else {
    readFileAsync(
      path.join(moviesFoldersPath, pathHash, "movies.json"),
      (data: any) => {
        const moviesFile = JSON.parse(data);
        event.reply("on-get-movies", moviesFile);
      },
      () => {}
    );
  }
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
