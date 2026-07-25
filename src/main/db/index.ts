import sqlite3, { SQLInputValue } from "node:sqlite";
import { applicationDatabasePath } from "../utils/paths";
import { Folder, Movie, SettingskeyValue, Subtitle } from "src/types/general";

let dataBase: sqlite3.DatabaseSync;

export const openDatabase = (): void => {
  dataBase = new sqlite3.DatabaseSync(":memory:");
  try {
    dataBase.exec(`
      BEGIN TRANSACTION;

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE,
        last_scan TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        path TEXT UNIQUE,
        duration INTEGER,
        watched INTEGER,
        last_opened TIMESTAMP,
        number_of_cards INTEGER,
        last_modified TIMESTAMP,
        size INTEGER,
        folder_id INTEGER,
        thumb_path TEXT,
        FOREIGN KEY(folder_id) REFERENCES folders(id)
      );

      CREATE TABLE IF NOT EXISTS subtitles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE,
        folder_id INTEGER,
        FOREIGN KEY(folder_id) REFERENCES folders(id)
      );

      CREATE TABLE IF NOT EXISTS movies_subtitles (
        movie_id INTEGER,
        subtitle_id INTEGER,
        FOREIGN KEY(movie_id) REFERENCES movies(id),
        FOREIGN KEY(subtitle_id) REFERENCES subtitles(id)
      );

      COMMIT;
    `);
  } catch (error) {
    console.log("AN ERROR OCURRED WHILE CREATING THE DATABASE");
    dataBase.exec(`ROLLBACK`);
    console.log(error);
  }
};

export const closeDataBase = (): void => {
  try {
    dataBase.close();
  } catch (error) {
    console.log("ERROR WHILE CLOSING THE DATABASE");
    console.log(error);
  }
};

export const insertNewMovies = (movies: Movie[]) => {
  dataBase.exec("BEGIN TRANSACTION;");
  let result = [];
  try {
    const insertQuery = dataBase.prepare(`
      INSERT INTO movies (
        title,
        path,
        duration,
        watched,
        last_opened,
        number_of_cards,
        last_modified,
        size,
        folder_id,
        thumb_path
      ) VALUES (
         ?,
         ?,
         ?,
         ?,
         ?,
         ?,
         ?,
         ?,
         ?,
         ?
      );
    `);

    for (const movie of movies) {
      const insertResult = insertQuery.run(
        movie.title,
        movie.path,
        movie.duration,
        movie.watched,
        movie.lastOpened.toISOString(),
        movie.numberOfCards,
        movie.lastModified.toISOString(),
        movie.size,
        movie.folderId,
        movie.thumbPath ? movie.thumbPath : null
      );
      result.push(insertResult.lastInsertRowid);
    }
    dataBase.exec("COMMIT;");
  } catch (error) {
    dataBase.exec("ROLLBACK;");
    console.log("ERROR WHILE INSERTING NEW MOVIES");
    console.log(error);
  }
  return result;
};

export const insertNewSubtitles = (subtitles: Subtitle[]) => {
  dataBase.exec("BEGIN TRANSACTION;");
  let result = [];
  try {
    const insertQuery = dataBase.prepare(`
      INSERT INTO subtitles (path, folder_id)
      VALUES (
        ?,
        ?
      );
    `);
    for (const subtitle of subtitles) {
      const insertResult = insertQuery.run(subtitle.path, subtitle.folderId);
      result.push(insertResult);
    }
    dataBase.exec("COMMIT;");
  } catch (error) {
    dataBase.exec("ROLLBACK;");
    console.log("ERROR WHILE INSERTING A NEW FOLDER");
    console.log(error);
  }
  return result;
};

export const insertNewFolder = (folder: Folder) => {
  dataBase.exec("BEGIN TRANSACTION;");
  try {
    const insertQuery = dataBase.prepare(`
      INSERT INTO folders (path, last_scan)
      VALUES (
        ?,
        ?
      );
    `);
    const result = insertQuery.run(folder.path, folder.lastScan.toISOString());
    dataBase.exec("COMMIT;");
    return result.lastInsertRowid;
  } catch (error) {
    dataBase.exec("ROLLBACK;");
    console.log("ERROR WHILE INSERTING A NEW FOLDER");
    console.log(error);
  }
};

export const getMovies = (): Movie[] | undefined => {
  try {
    const setelectQuery = dataBase.prepare("SELECT * FROM movies;");
    const result = setelectQuery.all() as unknown[] as Movie[];
    return result;
  } catch (error) {
    console.log("ERRORS WHILE TRYING TO GET MOVIES");
    console.log(error);
  }
};

export const getSubtitles = (): Subtitle[] | undefined => {
  try {
    const setelectQuery = dataBase.prepare("SELECT * FROM subtitles;");
    const result = setelectQuery.all() as unknown[] as Subtitle[];
    return result;
  } catch (error) {
    console.log("ERROR WHILE TRYING TO GET SUBTITLES");
    console.log(error);
  }
};

export const getSettings = (): SettingskeyValue[] | undefined => {
  try {
    const setelectQuery = dataBase.prepare("SELECT * FROM settings;");
    const result = setelectQuery.all() as unknown[] as SettingskeyValue[];
    return result;
  } catch (error) {
    console.log("ERROR WHILE TRYING TO GET SETTINGS");
    console.log(error);
  }
};

export const getFolders = (): Folder[] | undefined => {
  try {
    const setelectQuery = dataBase.prepare("SELECT * FROM folders;");
    const result = setelectQuery.all() as unknown[] as Folder[];
    return result;
  } catch (error) {
    console.log("ERROR WHILE TRYING TO GET FOLDERS");
    console.log(error);
  }
};
