import { app } from "../api";
import { Request } from "express";
import { albumCollection, knex } from "../";
import { getMetadata, Metadata } from "../metadata";

app.get("/album/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const album = albumCollection[id];

  if (!album) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const dbAlbum = await knex.select().from("album").where("path_id", id).first();

  let metadata = {};
  if (!dbAlbum) {
    const audioIds = album.files.map(({ id }) => id);
    const albumAudios = await knex.select().from("audio").whereIn("path_id", audioIds);

    if (Array.isArray(albumAudios) && albumAudios.length > 0) {
      metadata = buildMetadata(albumAudios[0].metadata);
    } else {
      const audioMetadata = await getMetadata(audioIds[0]);
      metadata = buildMetadata(audioMetadata);
    }

    console.log("Inserting album", id);
    await knex("album").insert({
      path_id: id,
      modified_at: new Date().toISOString(),
      filename: album.name,
      metadata,
    });
  } else {
    metadata = dbAlbum.metadata;
  }

  res.status(200).json({
    ...album,
    metadata,
  });
});

const buildMetadata = (metadata: Metadata) => {
  const { year, album, artists, artist, dynamicRangeAlbum, genre } = metadata;
  return { year, album, artists, artist, genre, dynamicRangeAlbum };
};
