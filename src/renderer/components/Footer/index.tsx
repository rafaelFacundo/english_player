import React, { useEffect, useState, useContext } from "react";
import "./index.css";
import SettingsIcon from "src/renderer/components/icons/SettingsIcon";
import Button from "src/renderer/components/Button";
import { ColorPicker } from "primereact/colorpicker";
import { AppContext } from "src/renderer/context/AppContext";

const Footer: React.FC = () => {
  const { state, setMoviesFolder, setDeckName } = useContext(AppContext);
  const moviesFolder = state.settingsData.moviesDirectoryPath;
  const subtitleColor = state.settingsData.subtitleColor;
  const subtitleBackgroundColor = state.settingsData.subtitleBackgroundColor;
  const deckName = state.settingsData.deckName;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [deckNameState, setDeckNameState] = useState<string>(deckName);
  const [subtitleColorState, setSubtitleColorState] =
    useState<string>(subtitleColor);
  const [subtitleBackgroundColorState, setSubtitleBackgroundColorState] =
    useState<string>(state.settingsData.subtitleBackgroundColor);
  const [moviesFolderState, setMoviesFolderState] =
    useState<string>(moviesFolder);

  const handleGetMoviesDirectoryPath = async () => {
    const path: string = await window.directory.getFolderPath();
    setMoviesFolder(path);
  };

  useEffect(() => {
    console.log("MOVIES OLDER CHANGED", moviesFolder);
    setMoviesFolderState(moviesFolder);
  }, [moviesFolder]);

  useEffect(() => {
    setSubtitleColorState(subtitleColor);
  }, [subtitleColor]);

  useEffect(() => {
    setSubtitleBackgroundColorState(subtitleBackgroundColor);
  }, [subtitleBackgroundColor]);

  useEffect(() => {
    setDeckNameState(deckName);
  }, [deckName]);

  console.log(state.settingsData.deckName, deckNameState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (deckNameState !== "" && deckNameState !== state.settingsData.deckName)
        setDeckName(deckNameState);
    }, 900);
    return () => clearTimeout(timeout);
  }, [deckNameState]);

  return (
    <div id="footer_container" className={expanded ? "footer_expanded" : ""}>
      <div id="footer_content">
        <label htmlFor="deck_name">Deck name:</label>
        <input
          name="deck_name"
          type="text"
          value={deckNameState}
          onChange={(e) => setDeckNameState(e.target.value)}
          placeholder="Write the deck you want to save your cards in"
        />
        <label htmlFor="video_files_folder">Folder to search videos:</label>
        <div id="footer_directoryButtonContainer">
          <button
            id="footer_selectDirectoryButton"
            onClick={() => {
              handleGetMoviesDirectoryPath();
            }}
          >
            Select the directory{" "}
          </button>
          <p id="footer_directoryPath">
            {moviesFolderState === ""
              ? "No directory selected"
              : moviesFolderState}
          </p>
        </div>

        <label htmlFor="">Subtitle color:</label>
        <ColorPicker
          format="hex"
          value={subtitleColorState}
          onChange={(e) => setSubtitleColorState(e.value as string)}
        />
        <label htmlFor="">subtitle background color:</label>
        <ColorPicker
          format="hex"
          value={subtitleBackgroundColorState}
          onChange={(e) => setSubtitleBackgroundColorState(e.value as string)}
        />
      </div>
      <Button icon={<SettingsIcon />} onClick={() => setExpanded(!expanded)} />
    </div>
  );
};

export default Footer;
