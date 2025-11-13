import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "src/renderer/context/AppContext";
import "./index.css";
import PlayIcon from "src/renderer/components/icons/PlayIcon";
import PauseIcon from "src/renderer/components/icons/PauseIcon";
import Button from "src/renderer/components/Button";
import BackTenSecondsIcon from "src/renderer/components/icons/BackTenSeconds";
import FowardTenSeconds from "src/renderer/components/icons/FowardTenSeconds";
import AspectRatioButton from "src/renderer/components/icons/AspectRatioButton";
import BackIcon from "src/renderer/components/icons/BackIcon";
import AddWordIcon from "src/renderer/components/icons/AddWordIcon";
import CancelAddIcon from "src/renderer/components/icons/CancelAddIcon";
import { DictionaryTranslation, Subtitle } from "src/types/general";
import axios from "axios";

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();
  const { state } = useContext(AppContext);
  const subtitleColor = state.settingsData.subtitleColor;
  const currentDeckName = state.settingsData.deckName;
  const subtitleBackground = state.settingsData.subtitleBackgroundColor;
  const [currentMoviePath, setCurrentMoviePath] = useState<string>("");
  const [playVideo, setPlayVideo] = useState<boolean>(false);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [percentageWatched, setPercentageWatched] = useState<number>(0);
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
  const [subtitleArray, setSubtitleArray] = useState<Subtitle[]>([]);
  const [currentSubtitleIndex, setCurrentSubTitleIndex] = useState<number>(0);
  const [currentSubtitleToShow, setCurrentSubtitleToShow] = useState<
    Subtitle | undefined
  >(undefined);
  const [dictionaryTranslation, setDictionaryTranslation] = useState<
    DictionaryTranslation | undefined
  >(undefined);
  const [currentWord, setCurrentWord] = useState<string>("");

  const aspectRatios = ["16 / 9", "1 / 1", "21 / 9", "4 / 3", "9 / 16"];

  const handlePlayOrPause = () => {
    setPlayVideo(!playVideo);
  };

  const handleAspectRatio = () => {
    if (currentAspectRatio === aspectRatios.length - 1) {
      setCurrentAspectRatio(0);
    } else {
      setCurrentAspectRatio(currentAspectRatio + 1);
    }
  };

  const handleSeekOnProgressBar = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!videoRef.current) return;
    const inputValue = parseFloat(event.target.value);
    const newTime = (inputValue / 100) * (videoDuration * 60);
    videoRef.current.currentTime = newTime;
    setPercentageWatched(inputValue);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const total = videoDuration * 60;
      setPercentageWatched((currentTime / total) * 100);
    }
  };

  const handleShowSubtitle = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const currentSubtitle = subtitleArray[currentSubtitleIndex];
      if (
        !currentSubtitleToShow &&
        currentTime >= currentSubtitle.startTime &&
        currentTime <= currentSubtitle.endTime
      ) {
        setCurrentSubtitleToShow(currentSubtitle);
      } else if (currentTime > currentSubtitle.endTime) {
        if (currentSubtitleIndex < subtitleArray.length - 1)
          setCurrentSubTitleIndex(currentSubtitleIndex + 1);
        setCurrentSubtitleToShow(undefined);
      }
    }
  };

  const handleSeekSubtitle = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;

      const index = subtitleArray.findIndex(
        (s) => currentTime >= s.startTime && currentTime <= s.endTime
      );

      if (index !== -1) {
        setCurrentSubTitleIndex(index);
        setCurrentSubtitleToShow(subtitleArray[index]);
      } else {
        setCurrentSubTitleIndex(
          subtitleArray.findIndex((s) => s.endTime > currentTime)
        );
        setCurrentSubtitleToShow(null);
      }
    }
  };

  const handleForwardTenSeconds = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleBackTenSeconds = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handleClickWord = async (word: string) => {
    if (videoRef.current) {
      videoRef.current.pause();
      const wordToSearch = word.trimEnd().replace(/[.,?!;:]/, "");
      const data = (
        await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`
        )
      ).data;
      const audio = data[0].phonetics.find(
        (element: any) => element.audio !== ""
      );
      setDictionaryTranslation({
        meaning: data[0].meanings[0].definitions[0].definition || "",
        example: data[0].meanings[0].definitions[0].example,
        pronounceUrl: audio.audio,
      });
      setCurrentWord(word);
    }
  };

  const cleanTranslation = () => {
    setDictionaryTranslation(undefined);
    setCurrentWord("");
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleSaveWord = (word: string, meaning: string) => {
    window.deck.saveCard({
      front: word,
      back: meaning,
      deckName: currentDeckName,
    });
    setDictionaryTranslation(undefined);
    setCurrentWord("");
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentMovie = state.currentMovieBeingWatched;
      if (currentMovie !== -1) {
        const currentMovieObject = state.moviesData.find(
          (movie) => movie.id === currentMovie
        );
        setVideoDuration(currentMovieObject.duration);
        setCurrentMoviePath(`video://${currentMovieObject.path}`);
        const subtitleResponse = await fetch(
          `subtitle://${currentMovieObject.subtitlesPath}`
        );

        const jsonnn = await subtitleResponse.json();
        setSubtitleArray(jsonnn);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentMoviePath !== "" && videoRef.current !== null) {
      setPlayVideo(true);
    }
  }, [currentMoviePath]);

  useEffect(() => {
    if (currentMoviePath !== "" && videoRef.current !== null) {
      if (playVideo) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playVideo]);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const threshold = 3000;
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMovement = () => {
      container.style.cursor = "auto";
      setIsMouseMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMouseMoving(false);
        container.style.cursor = "none";
      }, threshold);
    };

    container.addEventListener("mousemove", handleMouseMovement);
    container.addEventListener("mouseover", handleMouseMovement);

    return () => {
      container.removeEventListener("mousemove", handleMouseMovement);
      container.removeEventListener("mouseover", handleMouseMovement);
    };
  }, []);

  return (
    <div ref={videoContainerRef} id="videoPlayer_container">
      {currentMoviePath !== "" ? (
        <div id="videoPlayer_videoAndControls_container">
          <video
            ref={videoRef}
            id="videoPlayer_video_player"
            height={"100%"}
            style={{ aspectRatio: aspectRatios[currentAspectRatio] }}
            onTimeUpdate={() => {
              handleShowSubtitle();
              handleTimeUpdate();
            }}
            onSeeked={() => handleSeekSubtitle()}
          >
            <source src={currentMoviePath} type="video/mp4" />
          </video>
          {currentSubtitleToShow && (
            <div
              id="videoPlayer_subtitlesContainer"
              style={{
                color: `#${subtitleColor}`,
                backgroundColor: `#${subtitleBackground}`,
                bottom: isMouseMoving ? "250px" : "50px",
              }}
            >
              {currentSubtitleToShow.firstLIne !== "" && (
                <div id="videoPlayer_subtitlesContainer_firstLine">
                  {currentSubtitleToShow.firstLIne.split(" ").map((word) => (
                    <span
                      onClick={() => handleClickWord(word)}
                      style={{ marginRight: "16px", cursor: "pointer" }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
              )}
              {currentSubtitleToShow.firstLIne !== "" && (
                <div id="videoPlayer_subtitlesContainer_secondLine">
                  {currentSubtitleToShow.secondline.split(" ").map((word) => (
                    <span
                      onClick={() => handleClickWord(word)}
                      style={{ marginRight: "16px", cursor: "pointer" }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {isMouseMoving && (
            <div id="videoPlayer_controls_and_progres_bar">
              <input
                type="range"
                id="videoPlayer_progressBar"
                min={0}
                max={100}
                value={percentageWatched}
                onChange={handleSeekOnProgressBar}
              />

              <div id="videoPlayer_controls_buttons">
                <Button
                  className="videoPlayer_controlButton"
                  icon={<BackIcon />}
                  onClick={() => {
                    navigate(-1);
                  }}
                />
                <Button
                  className="videoPlayer_controlButton"
                  icon={<BackTenSecondsIcon />}
                  onClick={() => handleBackTenSeconds()}
                />
                <Button
                  className="videoPlayer_controlButton"
                  onClick={() => handlePlayOrPause()}
                  icon={!playVideo ? <PlayIcon /> : <PauseIcon />}
                />
                <Button
                  className="videoPlayer_controlButton"
                  icon={<FowardTenSeconds />}
                  onClick={() => handleForwardTenSeconds()}
                />
                <Button
                  className="videoPlayer_controlButton"
                  icon={<AspectRatioButton />}
                  onClick={() => handleAspectRatio()}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Carregando filme</p>
      )}
      {dictionaryTranslation && (
        <div id="videoPlayer_dictionaryResponse">
          <h3 id="videoPlayer_dictionaryResponse_meaning">
            {dictionaryTranslation.meaning}
          </h3>
          <audio controls>
            <source
              src={dictionaryTranslation.pronounceUrl}
              type="audio/mpeg"
            />
          </audio>
          {dictionaryTranslation.example !== "" && (
            <>
              <h4>Example: </h4>
              <h5>{dictionaryTranslation.example}</h5>
            </>
          )}
          <div id="videoPlayer_dictionaryResponse_buttonsContainer">
            <Button
              icon={<CancelAddIcon />}
              onClick={() => cleanTranslation()}
            />
            <Button
              icon={<AddWordIcon />}
              onClick={() =>
                handleSaveWord(currentWord, dictionaryTranslation.meaning)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;
