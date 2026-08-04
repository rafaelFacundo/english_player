import { net } from "electron";

export const handleImageProtocol = (request: Request) => {
  const filePath = request.url.slice("image://".length);
  if (filePath) {
    return net.fetch(`file:///${filePath}`);
  }
};
