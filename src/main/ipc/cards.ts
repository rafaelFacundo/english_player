import { IpcMainEvent } from "electron";
import { Card } from "src/types/general";

export const handleSaveCard = async (event: IpcMainEvent, data: Card) => {
  await fetch("http://127.0.0.1:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createDeck",
      version: 6,
      params: { deck: data.deckName },
    }),
  });
  const response = await fetch("http://127.0.0.1:8765", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "addNote",
      version: 6,
      params: {
        note: {
          deckName: data.deckName,
          modelName: "Basic",
          fields: {
            Front: data.front,
            Back: data.back,
          },
          options: {
            allowDuplicate: true,
          },
          tags: ["auto"],
        },
      },
    }),
  });
  const result = await response.json();
  console.log("RESULLLTT", result);
};
