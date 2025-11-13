import React from "react";
import appLogo from "src/assets/app_logo.png";
import "./index.css";
import Button from "../Button";
import RefreshIcon from "../icons/RefreshIcon";
import { useContext } from "react";
import { AppContext } from "src/renderer/context/AppContext";

const Header: React.FC = () => {
  const { state } = useContext(AppContext);
  const currentMovieFolder = state.settingsData.moviesDirectoryPath;

  return (
    <div id="header_container">
      <div id="header_app_logo">
        <img src={appLogo} alt="logo of the app" />
        <h1 id="app_name">English player</h1>
      </div>
      <Button icon={<RefreshIcon />} onClick={() => {}} />
    </div>
  );
};

export default Header;
