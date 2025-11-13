export const srtTimeToSeconds = (srtTime: string) => {
  const [hours, minutes, rest] = srtTime.split(":");
  const [seconds, milliseconds] = rest.split(",");

  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10) +
    parseInt(milliseconds, 10) / 1000
  );
};
