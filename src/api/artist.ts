import { app } from "../api";
import { Request } from "express";
import { artistCollection, artistObject } from "../";
import { knex } from "../db";

app.get("/artist/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const artist = artistCollection[id];

  if (!artist) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const albums = await Promise.all(
    artist.albums.map(async ({ name, url, coverUrl, firstAlbumAudio }) => {
      let year = null;
      if (firstAlbumAudio && firstAlbumAudio.id) {
        const audio = await knex
          .select("metadata")
          .from("audio")
          .where("path_id", firstAlbumAudio.id)
          .first();
        year = audio?.metadata?.year;
      }
      return { name, url, coverUrl, year };
    })
  );

  res.status(200).json({
    ...artist,
    albums: albums.sort((a, b) => a.year - b.year),
    files: artist.files.map(({ name, url, fileUrl }) => ({ name, url, fileUrl })),
    images: artist.images.map(({ name, url, fileUrl }) => ({ name, url, fileUrl })),
  });
});

app.get("/artists", (_req, res) => {
  res.status(200).json(artistObject);
});
