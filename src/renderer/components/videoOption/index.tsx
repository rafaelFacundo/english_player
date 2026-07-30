import React, { useContext, useState } from "react";
import Button from "src/renderer/components/IconButton";
import PlayIcon from "src/renderer/components/icons/PlayIcon";
import { Movie } from "src/types/general";
import { AppContext } from "src/renderer/context/AppContext";
import { useNavigate } from "react-router";
import { Box, Tooltip, Typography } from "@mui/material";
import MockImage from "src/assets/mock_image.jpg";
import VideoNameIcon from "../icons/VideoNameIcon";
import IconAndText from "../IconAndText";
import DurationIcon from "../icons/DurationIcon";
import CardIcon from "../icons/cardIcon";
import SubtitleIcon from "../icons/SubtitleIcon";

type VideoOptionProps = {
  movie: Movie;
  disableAnimation: boolean;
};

const VideoOption: React.FC<VideoOptionProps> = ({
  disableAnimation,
  movie,
}) => {
  const navigate = useNavigate();
  const { state, setCurrentMovie } = useContext(AppContext);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      title={movie.title}
      open={disableAnimation && showTooltip}
      followCursor
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [10, 14],
              },
            },
          ],
        },
      }}
    >
      <Box
        onMouseEnter={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        sx={{
          width: "171px",
          height: "239px",
          backgroundColor: "#16031C",
          borderRadius: "15px",
          overflow: "hidden",
          transition: "0.5s all ease-out",
          display: "flex",
          "&:hover": {
            width: !disableAnimation ? "471px" : "171px",
            cursor: "pointer",
          },
        }}
        onClick={() => {
          setCurrentMovie(movie.path);
          navigate("/video");
        }}
      >
        <Box
          sx={{
            minWidth: "171px",
            minHeight: "239px",
            backgroundImage: `url(image://${movie.thumbPath})`,
            backgroundPosition: "center",
            borderRadius: "15px",
            "& svg": {
              width: "42px",
              height: "42px",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayIcon />
        </Box>
        <Box
          sx={{
            flex: 1,
            paddingLeft: "20px",
            paddingTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "flex-start",
          }}
          className="teste"
        >
          <IconAndText checkSize icon={<VideoNameIcon />} text={movie.title} />
          <IconAndText icon={<DurationIcon />} text={`${movie.duration}`} />
          <IconAndText
            icon={<CardIcon />}
            text={`${movie.numberOfCards} cards added`}
          />
          <IconAndText
            icon={<SubtitleIcon />}
            text={"Subtitle file: adalksmdlaksm.srt"}
          />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default VideoOption;
