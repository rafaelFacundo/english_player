import fsPromisse from "node:fs/promises";
import fs from "node:fs";

export const createAfile = async (
  path: string,
  data: any,
  callback: (data: any) => void,
  errorCallback: () => void
) => {
  try {
    await fsPromisse.writeFile(path, data, { encoding: "utf-8", flag: "w" });
    callback(data);
  } catch (error) {
    console.log("THERE IS AN ERROR WHILE WRITING FILE");
    console.log(error);
    errorCallback();
  }
};

export const createDirSync = (path: string) => {
  try {
    fs.mkdirSync(path, { recursive: true });
  } catch (error) {
    console.log(`ERROR WHILE CREATING THE DIRECTORY ${path}`);
    console.log(error);
  }
};

export const readFileAsync = async (
  path: string,
  callback: (data: any) => void,
  errorCallback: () => void
) => {
  fs.readFile(path, { encoding: "utf8", flag: "r" }, (error, data) => {
    if (error) {
      console.log(`ERROR WHILE READING THE FILE ${path}`);
      console.log(error);
      errorCallback();
      return;
    }
    callback(data);
  });
};
