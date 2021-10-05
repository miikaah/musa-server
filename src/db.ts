import knexConstructor from "knex";
import path from "path";
import fs from "fs/promises";
import { getMetadata, Metadata, UrlSafeBase64 } from "musa-core";
import { AlbumWithFiles } from "musa-core";

const { MUSA_SRC_PATH = "", DB_HOST, DB_USER, DB_PASSWORD } = process.env;

export const knex = knexConstructor({
  client: "pg",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    charset: "utf8",
    database: "musa",
  },
  pool: { min: 4, max: 10 },
});

export type DbAlbum = {
  path_id: string;
  filename: string;
  metadata: {
    album: {
      files: {
        id: string;
        name: string;
        url: string;
        fileUrl: string;
      }[];
    };
  };
};

type AudioInsert = {
  id: string;
  filename: string;
};

type AudioUpsert = {
  id: string;
  filename: string;
  quiet?: boolean;
};

export const insertAudio = async (file: AudioInsert) => {
  if (!file) {
    return;
  }
  const { id, filename } = file;
  const metadata = await getMetadata({ id, quiet: true });

  await knex("audio").insert({
    path_id: id,
    modified_at: new Date().toISOString(),
    filename,
    metadata,
  });
};

export const upsertAudio = async (file: AudioUpsert): Promise<void> => {
  const { id, filename, quiet = false } = file;

  if (!id || !filename) {
    return;
  }

  const filepath = path.join(MUSA_SRC_PATH, UrlSafeBase64.decode(id));
  const stats = await fs.stat(filepath);
  const modifiedAt = new Date(stats.mtimeMs);
  const dbAudio = await knex.select().from("audio").where("path_id", id).first();

  let metadata = dbAudio?.metadata;
  if (!dbAudio) {
    metadata = await getMetadata({ id, quiet });

    console.log("Inserting audio", id);
    await knex("audio").insert({
      path_id: id,
      modified_at: modifiedAt.toISOString(),
      filename,
      metadata,
    });
  } else if (modifiedAt.getTime() > new Date(dbAudio.modified_at).getTime()) {
    metadata = await getMetadata({ id, quiet });

    console.log("Updating audio", filename, "because it was modified at", modifiedAt);
    await knex("audio").where("path_id", id).update({
      modified_at: modifiedAt.toISOString(),
      filename,
      metadata,
    });
  }
};

type AlbumMetadata = Partial<
  Pick<
    Metadata,
    "year" | "album" | "artists" | "artist" | "albumArtist" | "dynamicRangeAlbum" | "genre"
  >
>;

type AlbumUpsert = {
  id: string;
  album: AlbumWithFiles;
};

export const upsertAlbum = async (file: AlbumUpsert): Promise<void> => {
  if (!file) {
    return;
  }
  const { id, album } = file;
  const albumAudioIds = album.files.map(({ id }) => id);
  const dbAlbum = await knex.select().from("album").where("path_id", id).first();
  const dbAlbumAudios = await knex.select().from("audio").whereIn("path_id", albumAudioIds);
  const modifiedAts = dbAlbumAudios.map(({ modified_at }) => new Date(modified_at).getTime());
  const lastModificationTime = Math.max(...modifiedAts);
  const dbAlbumAudio = dbAlbumAudios[0];

  if (!dbAlbumAudio) {
    return;
  }

  const metadata = buildAlbumMetadata(dbAlbumAudio.metadata);
  if (!dbAlbum) {
    await knex("album").insert({
      path_id: id,
      modified_at: new Date().toISOString(),
      filename: album.name,
      metadata,
    });
  } else if (new Date(dbAlbum.modified_at).getTime() < lastModificationTime) {
    console.log(
      "Updating album",
      album.name,
      "because it was modified at",
      new Date(lastModificationTime).toISOString()
    );
    await knex("album").where("path_id", id).update({
      modified_at: new Date().toISOString(),
      filename: album.name,
      metadata,
    });
  }
};

const buildAlbumMetadata = (metadata: Metadata): AlbumMetadata => {
  const { year, album, artists, artist, albumArtist, genre, dynamicRangeAlbum } = metadata;
  return { year, album, artists, artist, albumArtist, genre, dynamicRangeAlbum };
};

export const getAudio = async (id: string) => {
  return knex.select().from("audio").where("path_id", id).first();
};

export const getAudiosWithFields = async (fields: string[]) => {
  return knex.select(fields).from("audio");
};
