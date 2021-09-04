import { Request } from "express";
import { app } from "../api";
import { audioCollection } from "../";
import { getMetadata } from "../metadata";
import { upsertAudio } from "../db";

app.get("/audio/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const audio = audioCollection[id];

  if (!audio) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const metadata = await upsertAudio({ id, audio });

  res.status(200).json({
    ...audio,
    metadata,
  });
});

app.get("/audio/:id/metadata", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const audio = audioCollection[id];

  if (!audio) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const metadata = await getMetadata(id);

  res.status(200).json(metadata);
});
