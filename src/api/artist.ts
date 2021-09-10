import { app } from "../api";
import { Request } from "express";
import { artistCollection, artistList } from "../";
import { knex, insertArtist } from "../db";

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
    albums: artist.albums.map(({ name, url, coverUrl }) => ({ name, url, coverUrl })),
    files: artist.files.map(({ name, url, fileUrl }) => ({ name, url, fileUrl })),
    images: artist.images.map(({ name, url, fileUrl }) => ({ name, url, fileUrl })),
    metadata,
  });
});

app.get("/artists", (_req, res) => {
  res.status(200).json(artistList);
});
