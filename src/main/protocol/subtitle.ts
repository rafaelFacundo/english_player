import fs from "node:fs";
import { srtTimeToSeconds } from "../utils/time";

export const handleSubtitleProtocol = (request: Request) => {
  const filePath = request.url.slice("subtitle:/".length);
  const fileData = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
  const patternToMatch = /\r\n/;
  const subtitlesArray = fileData.split(patternToMatch);
  let nextEmptyCharacter = subtitlesArray.findIndex((element, index, array) => {
    if (element === "") return true;
  });
  let newArray = [...subtitlesArray];
  const newArraySubtitles = [];
  while (nextEmptyCharacter !== -1) {
    const newSubtitleSegment = newArray.slice(0, nextEmptyCharacter + 1);
    const subtitleObject = {
      startTime: srtTimeToSeconds(newSubtitleSegment[1].split(" --> ")[0]),
      endTime: srtTimeToSeconds(newSubtitleSegment[1].split(" --> ")[1]),
      firstLIne: newSubtitleSegment[2],
      secondline: newSubtitleSegment[3],
    };
    newArraySubtitles.push(subtitleObject);
    newArray = newArray.splice(nextEmptyCharacter + 1);
    nextEmptyCharacter = newArray.findIndex((element, index, array) => {
      if (element === "") return true;
    });
  }

  const headers = new Headers([["Content-Type", "application/json"]]);

  return new Response(JSON.stringify(newArraySubtitles), {
    status: 200,
    headers,
  });
};
