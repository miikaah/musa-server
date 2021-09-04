import path from "path";
import fs from "fs/promises";
import { knex } from "./";
import UrlSafeBase64 from "./urlsafe-base64";
import { getMetadata, Metadata } from "./metadata";

const { MUSA_SRC_PATH = "" } = process.env;

type AudioUpsert = {
  id: string;
  audio: { name: string };
};

export const upsertAudio = async ({ id, audio }: AudioUpsert): Promise<Metadata> => {
  const filepath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const stats = await fs.stat(filepath);
  const modifiedAt = new Date(stats.mtimeMs);
  const dbAudio = await knex.select().from("audio").where("path_id", id).first();

  let metadata = dbAudio?.metadata;
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

  return metadata;
};

type AlbumInsert = {
  id: string;
  album: { name: string; files: { id: string; name: string }[] };
};

export const insertAlbum = async ({ album, id }: AlbumInsert): Promise<Metadata> => {
  const audioIds = album.files.map(({ id }) => id);
  const albumAudios = await knex.select().from("audio").whereIn("path_id", audioIds);

  let metadata = {};
  if (Array.isArray(albumAudios) && albumAudios.length > 0) {
    metadata = buildAlbumMetadata(albumAudios[0].metadata);
  } else {
    const audio = album.files[0];
    const audioMetadata = await upsertAudio({ id: audio.id, audio });
    metadata = buildAlbumMetadata(audioMetadata);
  }

  console.log("Inserting album", id);
  await knex("album").insert({
    path_id: id,
    modified_at: new Date().toISOString(),
    filename: album.name,
    metadata,
  });

  return metadata;
};

const buildAlbumMetadata = (metadata: Metadata) => {
  const { year, album, artists, artist, dynamicRangeAlbum, genre } = metadata;
  return { year, album, artists, artist, genre, dynamicRangeAlbum };
};
