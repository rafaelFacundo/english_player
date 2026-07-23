import sqlite3 from "node:sqlite";
import { applicationDatabasePath } from "../utils/paths";

let dataBase: sqlite3.DatabaseSync;

export const openDatabase = (): void => {
  try {
    dataBase = new sqlite3.DatabaseSync(applicationDatabasePath);
    dataBase.exec(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT NOT NULL
      );
    `);
    dataBase.exec(`CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE,
        last_scan TIMESTAMP NOT NULL
      );
    `);
    dataBase.exec(`CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        path TEXT UNIQUE,
        durantion INTEGER,
        watched INTEGER,
        last_opened TIMESTAMP,
        number_of_cards INTEGER,
        las_modified TIMESTAMP,
        size INTEGER,
        folder_id INTEGER,
        FOREIGN KEY(folder_id) REFERENCES folders(id)
      );
    `);
    dataBase.exec(`CREATE TABLE IF NOT EXISTS thumbs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE,
        movie_id INTEGER,
        FOREIGN KEY(movie_id) REFERENCES movies(id)
      );
    `);
    dataBase.exec(`CREATE TABLE IF NOT EXISTS subtitles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE
      );
    `);
    dataBase.exec(`CREATE TABLE IF NOT EXISTS movies_subtitles (
        movie_id INTEGER,
        subtitle_id INTEGER,
        FOREIGN KEY(movie_id) REFERENCES movies(id),
        FOREIGN KEY(subtitle_id) REFERENCES subtitles(id)
      );
    `);
  } catch (error) {
    console.log("AN ERROR OCURRED WHILE CREATING THE DATABASE");
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
