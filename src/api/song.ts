import { app } from "../api";
import { Request } from "express";
import path from "path";
import { songCollection } from "../";
import UrlSafeBase64 from "../urlsafe-base64";
import { readMetadata } from "../metadata";

const { MUSA_SRC_PATH = "" } = process.env;

app.get("/song/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const song = songCollection[id];

  if (!song) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const metadata = await getMetadata(id);

  res.status(200).json({
    ...song,
    metadata,
  });
});

app.get("/song/:id/metadata", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const song = songCollection[id];

  if (!song) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const metadata = await getMetadata(id);

  res.status(200).json(metadata);
});

const getMetadata = async (id: string) => {
  const songPath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const { native, common } = await readMetadata(songPath);
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
