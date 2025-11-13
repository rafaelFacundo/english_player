import fs from "node:fs";
import { createReadableStream } from "src/main/utils/stream";

export const handleVideoProtocol = (request: Request) => {
  const filePath = request.url.slice("video:/".length);
  const videoSize = fs.statSync(filePath).size;

  const chunkSize = 10 ** 6;
  const start = Number(request.headers.get("range").replace(/\D/g, ""));
  const end = Number(
    request.headers.get("range").match(/-(\d+)/)?.[1] || `${videoSize - 1}`
  ); //Math.min(start + chunkSize, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = new Headers([
    ["Accept-Ranges", "bytes"],
    ["Content-Type", "video/mp4"],
    ["Content-Length", `${contentLength}`],
    ["Content-Range", `bytes ${start}-${end}/${videoSize}`],
  ]);

  const videoStream = fs.createReadStream(filePath, { start, end });

  return new Response(createReadableStream(videoStream), {
    headers,
    status: 206,
  });
};
