import fs from "node:fs";

export const createReadableStream = (resultStream: fs.ReadStream) => {
  resultStream.pause();

  let closed = false;

  return new ReadableStream(
    {
      start: (controller) => {
        resultStream.on("data", (chunk) => {
          if (closed) {
            return;
          }

          if (Buffer.isBuffer(chunk)) {
            controller.enqueue(new Uint8Array(chunk));
          } else {
            controller.enqueue(chunk);
          }

          if (controller.desiredSize <= 0) {
            resultStream.pause();
          }
        });

        resultStream.on("error", (error) => {
          controller.error(error);
        });

        resultStream.on("end", () => {
          if (!closed) {
            closed = true;
            controller.close();
          }
        });
      },
      pull: (_controller) => {
        if (closed) {
          return;
        }

        resultStream.resume();
      },
      cancel: () => {
        if (!closed) {
          closed = true;
          resultStream.close();
        }
      },
    },
    { highWaterMark: resultStream.readableHighWaterMark }
  );
};
