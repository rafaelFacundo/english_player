import { net } from "electron";

export const handleImageProtocol = (request: Request) => {
  const filePath = request.url.slice("image://".length);

  return net.fetch(`file:///${filePath}`);
};
