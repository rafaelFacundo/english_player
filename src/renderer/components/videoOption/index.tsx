import React, { useContext } from "react";
import "./index.css";
import Button from "src/renderer/components/Button";
import PlayIcon from "src/renderer/components/icons/PlayIcon";
import { Movie } from "src/types/general";
import { AppContext } from "src/renderer/context/AppContext";
import { useNavigate } from "react-router";

type VideoOptionProps = {
  movie: Movie;
};

const VideoOption: React.FC<VideoOptionProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { state, setCurrentMovie } = useContext(AppContext);

  const handleClick = () => {
    setCurrentMovie(movie.id);
    navigate("/video");
  };

  return (
    <div id="videoOption_container" onClick={handleClick}>
      <div id="videoOption_thumbContainer">
        <Button className={"videoOption_playButton"} icon={<PlayIcon />} />
        <img id="videoOption_image" src={`image://${movie.thumbPath}`} />
      </div>
      <div id="videoOption_videoInfosContainer">
        <h3 className="info">{movie.title}</h3>
        <h4 className="info">{Math.round(movie.duration)}min</h4>
      </div>
    </div>
  );
};

export default VideoOption;
