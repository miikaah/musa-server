import { Request } from "express";
import { app } from "../api";
import { audioCollection, albumCollection } from "../";
import { knex } from "../db";

app.get("/audio/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const audio = audioCollection[id];

  if (!audio) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const dbAudio = await knex.select("metadata").from("audio").where("path_id", id).first();
  const { albumId } = audio;

  let coverUrl, albumName;
  if (albumId) {
    const album = albumCollection[albumId];
    const dbAlbum = await knex.select("metadata").from("album").where("path_id", albumId).first();

    coverUrl = album.coverUrl;
    albumName = dbAlbum?.metadata?.album;
  }

  const { name, artistName, artistUrl, albumName: albumFolderName, albumUrl, url } = audio;

  res.status(200).json({
    name,
    artistName,
    artistUrl,
    albumName: albumName || albumFolderName,
    albumUrl,
    fileUrl: url,
    coverUrl,
    metadata: dbAudio?.metadata,
  });
});
