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
  type?: FileType;
  folderId: number | bigint;
};

export type Movie = File & {
  id?: number;
  title: string;
  duration: number;
  watched: number;
  lastOpened: Date;
  numberOfCards: number;
  lastModified: Date;
  size: number;
  subtitlesPath?: string[];
  thumbPath?: string;
};

export type Settings = {
  subtitle_color: string;
  subtitle_background_color: string;
  movies_directory_path: string | null;
};

export type SettingskeyValue = {
  id: number;
  key: keyof Settings;
  value: string | null;
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

export type Folder = {
  id?: number;
  path: string;
  lastScan: Date;
};
