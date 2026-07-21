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
import { moviesFoldersPath, moviesIndexFIlePath } from "src/main/utils/paths";

const getFileExtension = (data: Dirent): string => {
  return path.extname(path.join(data.parentPath, data.name));
};

const getMovieDuration = (data: Dirent): number => {
  /* const videoPath = path.join(data.parentPath, data.name);
  const stdout = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videoPath}`
  ).toString(); */
  return Math.round(Number(1)) / 60;
};

const getMovieThumb = (data: Dirent, newPath: string): string => {
  /* const thumbsPath = path.join(newPath, "thumbs");
  const videoPath = path.join(data.parentPath, data.name);
  const videoNameHash = crypto.hash("sha256", data.name);
  const thumbImagePath = `${thumbsPath}/${videoNameHash}.jpg`;
  execSync(
    `ffmpeg -v error -ss 00:10:10 -i ${videoPath} -frames:v 1 -q:v 2 ${thumbImagePath}`
  ); */
  return "thumbImagePath";
};

const getSubtitleInfo = (item: fs.Dirent<string>): Subtitle => {
  const subtitleFile: Subtitle = {
    path: path.join(item.parentPath, item.name),
    type: FileType.Subtitle,
  };
  return subtitleFile;
};

const getMovieInfo = (item: fs.Dirent<string>, newPath: string): Movie => {
  const movie: Movie = {
    duration: 0,
    subtitlesPath: "",
    thumbPath: "",
    title: "",
    watchedTime: 0,
    type: FileType.Movie,
    path: path.join(item.parentPath, item.name),
  };
  movie.thumbPath = getMovieThumb(item, newPath);
  movie.duration = getMovieDuration(item);
  movie.title = item.name;
  return movie;
};

const handleStackItem = (
  item: fs.Dirent<string>,
  newPath: string
): File | undefined => {
  const fileExtension = getFileExtension(item);
  if (fileExtension === ".mp4") {
    return getMovieInfo(item, newPath);
  } else if (fileExtension === ".srt") {
    return getSubtitleInfo(item);
  }
};

const seekFiles = (pathToSearch: string, newPath: string): File[] => {
  let files: File[] = [];
  const filesStack: fs.Dirent<string>[] = fs.readdirSync(pathToSearch, {
    withFileTypes: true,
  });
  //console.log("FILESa: ", filesStack[filesStack.length - 1]);

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
      files.push(handleStackItem(stackItem, newPath));
      filesStack.pop();
    }
  }

  console.log("files array final result");
  console.log(files);

  /* for (const data of dirFiles) {
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
  } */
  /* if (movieT.id !== -1) {
    movies.push(movieT);
  } */
  return files;
};

export const handleSearchForMovies = async (
  event: IpcMainEvent,
  folderPath: string
) => {
  const pathHash = crypto.hash("sha256", folderPath);
  const newMovieFolderPath = path.join(moviesFoldersPath, pathHash);

  seekFiles(folderPath, newMovieFolderPath);
  return;
  //const pathHash = crypto.hash("sha256", folderPath);
  const moviesIndexFile = JSON.parse(
    fs.readFileSync(moviesIndexFIlePath, {
      encoding: "utf8",
      flag: "r",
    })
  );
  if (!moviesIndexFile[pathHash]) {
    let movies: Movie[] = [];
    /*
      creating a movies folder, in each movie folder (that is identified by a
      hash generated from the path) there is a json(movies.json) with the path to 
      each file(thumbs, videos, and subtitles) and a folder with the thumbs from the videos
    */

    //adding the new folder path to the general folders file
    moviesIndexFile[pathHash] = folderPath;
    //creating the paths of the hash folder, thumbs and the movies.json file
    const newMovieFolderPath = path.join(moviesFoldersPath, pathHash);
    const thumbsPath = path.join(newMovieFolderPath, "thumbs");
    const moviesJsonFilePath = path.join(newMovieFolderPath, "movies.json");
    createDirSync(newMovieFolderPath);
    createDirSync(thumbsPath);
    //updating the general folders file
    await createAfile(
      moviesIndexFIlePath,
      JSON.stringify(moviesIndexFile),
      () => {},
      () => {}
    );
    //DFS on the selected movies folder
    //movies = movies.concat(seekFiles(folderPath, 0, newMovieFolderPath));
    //writing the movies.json on the new hash folder
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
