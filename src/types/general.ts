export type MovieDuration = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type Movie = {
  id: number;
  title: string;
  path: string;
  subtitlesPath: string;
  duration: number;
  thumbPath: string;
};

export type Settings = {
  subtitleColor: string;
  subtitleBackgroundColor: string;
  deckName: string;
  moviesDirectoryPath: string;
};

export type Subtitle = {
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
