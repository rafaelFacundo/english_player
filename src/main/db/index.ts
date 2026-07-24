import sqlite3 from "node:sqlite";
import { applicationDatabasePath } from "../utils/paths";

let dataBase: sqlite3.DatabaseSync;

export const openDatabase = (): void => {
  dataBase = new sqlite3.DatabaseSync(applicationDatabasePath);
  try {
    //console.log("ADAD", dataBase);
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
        FOREIGN KEY(folder_id) REFERENCES folders(id)
      );
      
      CREATE TABLE IF NOT EXISTS thumbs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE,
        movie_id INTEGER,
        FOREIGN KEY(movie_id) REFERENCES movies(id)
      );

      CREATE TABLE IF NOT EXISTS subtitles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE
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
