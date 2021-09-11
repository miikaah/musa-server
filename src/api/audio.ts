import { Request } from "express";
import { app } from "../api";
import { audioCollection } from "../";
import { knex } from "../db";

app.get("/audio/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const audio = audioCollection[id];

  if (!audio) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const dbAudio = await knex.select("metadata").from("audio").where("path_id", id).first();

  const { name: filename, artistName, artistUrl, albumName, albumUrl, url } = audio;

  res.status(200).json({
    filename,
    artistName,
    artistUrl,
    albumName,
    albumUrl,
    url,
    metadata: dbAudio?.metadata,
  });
});
