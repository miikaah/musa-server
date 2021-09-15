import { app } from "../api";
import { Request } from "express";
import { albumCollection } from "../";
import { knex, DbAlbum } from "../db";

app.get("/album/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const album = albumCollection[id];

  if (!album) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const dbAlbum = await knex.select<DbAlbum>().from("album").where("path_id", id).first();

  if (!dbAlbum) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const audioIds = album.files.map(({ id }: { id: string }) => id);
  const files = await knex.select().from("audio").whereIn("path_id", audioIds);
  const trackNumbers = files.map((file) => file?.metadata?.track?.no);
  const maxTrackNo = Math.max(...trackNumbers);
  const pad = `${maxTrackNo}`.length;

  const { path_id, filename, metadata } = dbAlbum;
  const mergedFiles = album.files
    .map(({ id, name: filename, url, fileUrl }) => {
      const file = files.find((f) => f.path_id === id);
      const name = file?.metadata?.title || filename;
      const trackNo = `${file?.metadata?.track?.no || ""}`;
      const diskNo = `${file?.metadata?.disk?.no || ""}`;
      const track = `${diskNo ? `${diskNo}.` : ""}${trackNo.padStart(pad, "0")}`;

      return {
        id,
        track,
        name,
        url,
        fileUrl,
      };
    })
    .sort((a, b) => a.track.localeCompare(b.track));
  const { images, coverUrl } = album;

  res.status(200).json({
    id: path_id,
    filename,
    coverUrl,
    metadata,
    files: mergedFiles,
    images,
  });
});
