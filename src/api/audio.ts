import { Request } from "express";
import path from "path";
import fs from "fs/promises";
import { app } from "../api";
import { audioCollection, knex } from "../";
import UrlSafeBase64 from "../urlsafe-base64";
import { readMetadata } from "../metadata";

const { MUSA_SRC_PATH = "" } = process.env;

app.get("/audio/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const audio = audioCollection[id];

  if (!audio) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const filepath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const stats = await fs.stat(filepath);
  const modifiedAt = new Date(stats.mtimeMs);
  const dbAudio = await knex.select().from("audio").where("path_id", id).first();

  let metadata = dbAudio;
  if (!dbAudio) {
    metadata = await getMetadata(id);

    console.log("Inserting", id);
    await knex("audio").insert({
      path_id: id,
      modified_at: modifiedAt.toISOString(),
      filename: audio.name,
      metadata,
    });
  } else if (modifiedAt.getTime() > new Date(dbAudio.modified_at).getTime()) {
    metadata = await getMetadata(id);

    console.log("Updating", id, "because it was modified at", modifiedAt);
    await knex("audio").where("path_id", id).update({
      modified_at: modifiedAt.toISOString(),
      filename: audio.name,
      metadata,
    });
  }

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

const getMetadata = async (id: string) => {
  const audioPath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const { native, common } = await readMetadata(audioPath);
  const id3v2point3 = native["ID3v2.3"] || [];
  const id3v2 = {
    dynamicRange: (id3v2point3.find((tag) => tag.id === "TXXX:DYNAMIC RANGE") || {}).value,
    dynamicRangeAlbum: (id3v2point3.find((tag) => tag.id === "TXXX:ALBUM DYNAMIC RANGE") || {})
      .value,
  };

  return {
    ...common,
    ...id3v2,
  };
};
