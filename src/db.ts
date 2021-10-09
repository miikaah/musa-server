import knexConstructor from "knex";
import path from "path";
import fs from "fs/promises";
import { getMetadata, Metadata, UrlSafeBase64, AlbumCollection, ArtistWithAlbums } from "musa-core";
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
  const metadata = await getMetadata(MUSA_SRC_PATH, { id, quiet: true });

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
    metadata = await getMetadata(MUSA_SRC_PATH, { id, quiet });

    console.log("Inserting audio", id);
    await knex("audio").insert({
      path_id: id,
      modified_at: modifiedAt.toISOString(),
      filename,
      metadata,
    });
  } else if (modifiedAt.getTime() > new Date(dbAudio.modified_at).getTime()) {
    metadata = await getMetadata(MUSA_SRC_PATH, { id, quiet });

    console.log("Updating audio", filename, "because it was modified at", modifiedAt);
    await knex("audio").where("path_id", id).update({
      modified_at: modifiedAt.toISOString(),
      filename,
      metadata,
    });
  }
};

type Album = { path_id: string; modified_at: string; metadata: Metadata };

export const getAlbum = async (id: string): Promise<Album> => {
  return knex.select().from("album").where("path_id", id).first();
};

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

const buildAlbumMetadata = (metadata: Metadata) => {
  const { year, album, artists, artist, albumArtist, genre, dynamicRangeAlbum } = metadata;
  return { year, album, artists, artist, albumArtist, genre, dynamicRangeAlbum };
};

type Audio = { path_id: string; modified_at: string; metadata: Metadata };

export const getAudio = async (id: string) => {
  return knex.select().from("audio").where("path_id", id).first();
};

export const getAudiosWithFields = async (fields: string[]) => {
  return knex.select(fields).from("audio");
};

export const getAudiosByIds = async (ids: string[]): Promise<Audio[]> => {
  return knex.select().from("audio").whereIn("path_id", ids);
};

export type Settings = {
  id: number;
  user_id: string;
  modified_at: string;
  json: unknown;
};

export const getSettings = async (): Promise<Settings | undefined> => {
  return knex.select<Settings>().from("settings").where("user_id", "default").first();
};

export const insertSettings = async (json: unknown): Promise<unknown> => {
  return knex("settings").insert({
    user_id: "default",
    modified_at: new Date().toISOString(),
    json,
  });
};

export const updateSettings = async (json: unknown): Promise<unknown> => {
  return knex("settings").where("user_id", "default").update({
    modified_at: new Date().toISOString(),
    json,
  });
};

export type Theme = {
  path_id: string;
  filename: string;
  modified_at: string;
  colors: unknown;
};

export const getTheme = async (id: string): Promise<Theme | undefined> => {
  return knex.select<Theme>().from("theme").where("path_id", id).first();
};

export type ThemeUpsert = {
  id: string;
  colors: unknown;
  filename: string;
};

export const insertTheme = async ({ id, filename, colors }: ThemeUpsert): Promise<unknown> => {
  return knex("theme").insert({
    path_id: id,
    filename,
    modified_at: new Date().toISOString(),
    colors,
  });
};

export const updateTheme = async ({ id, filename, colors }: ThemeUpsert): Promise<unknown> => {
  return knex("theme").where("path_id", id).update({
    filename,
    modified_at: new Date().toISOString(),
    colors,
  });
};

export const getAllThemes = async (): Promise<Theme[]> => {
  return knex().select().from("theme");
};

export type EnrichedAlbum = {
  id: string;
  name: string;
  url: string;
  coverUrl?: string;
  year?: number | null;
};

export const enrichAlbums = async (
  albumCollection: AlbumCollection,
  artist: ArtistWithAlbums
): Promise<EnrichedAlbum[]> => {
  return Promise.all(
    artist.albums.map(async ({ id, name, url, coverUrl, firstAlbumAudio }) => {
      let year = null;
      let albumName = null;

      if (firstAlbumAudio && firstAlbumAudio.id) {
        const audio = await getAudio(firstAlbumAudio.id);

        year = audio?.metadata?.year;
        albumName = audio?.metadata?.album;
      }

      const files = await enrichAlbumFiles(albumCollection[id]);

      return {
        id,
        name: albumName || name,
        url,
        coverUrl,
        year,
        files,
      };
    })
  );
};

export type EnrichedAlbumFile = {
  id?: string;
  name: string;
  track: string;
  fileUrl?: string;
  metadata?: Metadata;
};

export const enrichAlbumFiles = async (album: AlbumWithFiles): Promise<EnrichedAlbumFile[]> => {
  const audioIds = album.files.map(({ id }) => id);
  const files = await getAudiosByIds(audioIds);
  const trackNumbers = files.map((file) => Number(file?.metadata?.track?.no));
  const maxTrackNo = Math.max(...trackNumbers);
  const pad = `${maxTrackNo}`.length;
  const padLen = pad < 2 ? 2 : pad;

  const mergedFiles = await Promise.all(
    album.files.map(async ({ id, name: filename, fileUrl }) => {
      const file = files.find((f) => f.path_id === id);
      const name = file?.metadata?.title || filename;
      const trackNo = `${file?.metadata?.track?.no || ""}`;
      const diskNo = `${file?.metadata?.disk?.no || ""}`;
      const track = `${diskNo ? `${diskNo}.` : ""}${trackNo.padStart(padLen, "0")}`;

      return {
        id: file?.path_id,
        name,
        track,
        fileUrl,
        metadata: file?.metadata,
      };
    })
  );

  mergedFiles.sort((a, b) => a.track.localeCompare(b.track));

  return mergedFiles;
};
