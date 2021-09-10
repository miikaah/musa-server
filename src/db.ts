import knexConstructor from "knex";
import path from "path";
import fs from "fs/promises";
import UrlSafeBase64 from "./urlsafe-base64";
import { getMetadata, Metadata } from "./metadata";
import { AlbumFile, AlbumWithFiles } from "./media-separator";

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
});

type AudioInsert = {
  id: string;
  filename: string;
};

type AudioUpsert = {
  id: string;
  audio: { name: string };
  quiet?: boolean;
};

export const insertAudio = async ({ id, filename }: AudioInsert) => {
  const metadata = await getMetadata({ id, quiet: true });

  await knex("audio").insert({
    path_id: id,
    modified_at: new Date().toISOString(),
    filename,
    metadata,
  });
};

export const upsertAudio = async ({ id, audio, quiet = false }: AudioUpsert): Promise<Metadata> => {
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
      filename: audio.name,
      metadata,
    });
  } else if (modifiedAt.getTime() > new Date(dbAudio.modified_at).getTime()) {
    metadata = await getMetadata({ id, quiet });

    console.log("Updating audio", audio.name, "because it was modified at", modifiedAt);
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
  album?: AlbumWithFiles | AlbumFile;
  audio?: { id: string; name: string };
};

type AlbumMetadata = Partial<
  Pick<
    Metadata,
    "year" | "album" | "artists" | "artist" | "albumArtist" | "dynamicRangeAlbum" | "genre"
  >
>;

export const insertAlbum = async ({ id, album, audio }: AlbumInsert): Promise<AlbumMetadata> => {
  const audioId = audio?.id || (album as AlbumWithFiles).files[0]?.id;
  const dbAlbumAudio = await knex.select().from("audio").where("path_id", audioId).first();

  console.log("dbAlbumAudio", dbAlbumAudio);
  let metadata = {};
  if (dbAlbumAudio) {
    metadata = buildAlbumMetadata(dbAlbumAudio.metadata);
  } else {
    const albumAudio = audio || (album as AlbumWithFiles).files[0];
    const audioMetadata = await upsertAudio({ id: albumAudio.id, audio: albumAudio });
    metadata = buildAlbumMetadata(audioMetadata);
  }

  console.log("Inserting album", id);
  await knex("album").insert({
    path_id: id,
    modified_at: new Date().toISOString(),
    filename: (album as AlbumWithFiles).name,
    metadata,
  });

  return metadata;
};

type AlbumUpsert = {
  id: string;
  album: AlbumWithFiles;
};

export const upsertAlbum = async ({ id, album }: AlbumUpsert): Promise<void> => {
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
    const { artistUrl, files, images, coverUrl } = album;

    await knex("album").insert({
      path_id: id,
      modified_at: new Date().toISOString(),
      filename: album.name,
      metadata: {
        album: {
          artistUrl,
          files,
          images,
          coverUrl,
        },
        metadata,
      },
    });
  } else if (new Date(dbAlbum.modified_at).getTime() < lastModificationTime) {
    console.log(
      "Updating album",
      album.name,
      "because it was modified at",
      new Date(lastModificationTime).toISOString()
    );
    const { artistUrl, files, images, coverUrl } = album;

    await knex("album")
      .where("path_id", id)
      .update({
        modified_at: new Date().toISOString(),
        filename: album.name,
        metadata: {
          album: {
            artistUrl,
            files,
            images,
            coverUrl,
          },
          metadata,
        },
      });
  }
};

const buildAlbumMetadata = (metadata: Metadata): AlbumMetadata => {
  const { year, album, artists, artist, albumArtist, genre, dynamicRangeAlbum } = metadata;
  return { year, album, artists, artist, albumArtist, genre, dynamicRangeAlbum };
};

type ArtistInsert = {
  id: string;
  artist: {
    name: string;
    albums: AlbumFile[];
  };
};

type ArtistMetadata = {
  name: string;
};

export const insertArtist = async ({
  id,
  artist,
}: ArtistInsert): Promise<ArtistMetadata | undefined> => {
  console.log("Artist", artist.name);
  console.log("Album for metadata", artist.albums[0]);
  const albumId = artist.albums[0]?.id;

  if (!albumId) {
    return undefined;
  }

  const dbAlbum = await knex.select().from("album").where("path_id", albumId).first();

  console.log("dbAlbum", dbAlbum);
  let metadata = dbAlbum?.metadata;
  if (!metadata) {
    metadata = await insertAlbum({
      id: albumId,
      album: artist.albums[0],
      audio: artist.albums[0].firstAlbumAudio,
    });
  }
  const artistMetadata = {
    name: metadata.artist || metadata.artists?.[0] || metadata.albumArtist || "Missing artist name",
  };
  console.log("artistMetadata", metadata);

  console.log("Inserting artist", id);
  await knex("artist").insert({
    path_id: id,
    modified_at: new Date().toISOString(),
    filename: artist.name,
    metadata: artistMetadata,
  });

  return artistMetadata;
};

export const getAudio = async (id: string) => {
  return knex.select().from("audio").where("path_id", id).first();
};

export const getAudiosWithFields = async (fields: string[]) => {
  return knex.select(fields).from("audio");
};
