import { app } from "../api";
import { Request } from "express";
import { artistCollection, artistList, knex } from "../";
import { insertArtist } from "../db";

app.get("/artist/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const artist = artistCollection[id];

  if (!artist) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const dbArtist = await knex.select().from("artist").where("path_id", id).first();

  let metadata = dbArtist?.metadata;
  if (!dbArtist) {
    metadata = await insertArtist({ id, artist });
  }

  res.status(200).json({
    ...artist,
    metadata,
  });
});

app.get("/artists", (_req, res) => {
  res.status(200).json(artistList);
});
