export enum FileType {
  Movie,
  Subtitle,
}

export type MovieDuration = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type File = {
  path: string;
  type: FileType;
};

export type Movie = File & {
  title: string;
  subtitlesPath: string;
  duration: number;
  thumbPath: string;
  watchedTime: number;
};

export type Settings = {
  subtitleColor: string;
  subtitleBackgroundColor: string;
  deckName: string;
  moviesDirectoryPath: string;
};

export type Subtitle = File;

export type SubtitleLine = {
  endTime: number;
  firstLIne: string;
  secondline: string;
  startTime: number;
};

export type DictionaryTranslation = {
  meaning: string;
  example: string;
  pronounceUrl: string;
};

export type Card = {
  front: string;
  back: string;
  deckName: string;
};
