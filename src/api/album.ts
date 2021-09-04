import { app } from "../api";
import { Request } from "express";
import { albumCollection, knex } from "../";
import { insertAlbum } from "../db";

app.get("/album/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const album = albumCollection[id];

  if (!album) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const dbAlbum = await knex.select().from("album").where("path_id", id).first();

  let metadata = dbAlbum?.metadata;
  if (!dbAlbum) {
    metadata = await insertAlbum({ id, album });
  }

  res.status(200).json({
    ...album,
    metadata,
  });
});
