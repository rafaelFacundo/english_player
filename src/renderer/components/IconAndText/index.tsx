import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type IconAndTextProps = {
  icon: React.ReactNode | string;
  text: string;
  checkSize?: boolean;
};

const IconAndText: React.FC<IconAndTextProps> = ({ icon, text, checkSize }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeAnimation, setActiveAnimation] = useState<boolean>(false);

  useEffect(() => {
    const text = textRef.current;
    if (text && checkSize) {
      const resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          for (const entry of entries) {
            if (entry.target === text) {
              setActiveAnimation(
                entry.target.scrollWidth > entry.target.clientWidth
              );
            }
          }
        }
      );
      resizeObserver.observe(text);

      return () => {
        resizeObserver.unobserve(text);
      };
    }
  }, [text]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        "& svg": {
          width: "25px",
          height: "25px",
        },
        gap: "10px",
      }}
    >
      {icon}
      <Box
        sx={{
          overflow: "hidden",
          width: "100px",
          flex: 1,
        }}
      >
        <Typography
          sx={{
            color: "white",
            textWrap: "nowrap",

            animation: activeAnimation ? "marquee 9s linear infinite" : "",
            "@keyframes marquee": {
              from: {
                transform: "translatex(0)",
              },
              to: {
                transform: "translatex(-200%)",
              },
            },
          }}
          ref={textRef}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default IconAndText;
