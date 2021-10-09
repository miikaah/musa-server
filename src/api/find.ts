import { Request } from "express";
import { ArtistWithAlbums, AlbumWithFiles, Metadata, FileWithInfo } from "musa-core";
import fuzzysort from "fuzzysort";
import { app } from "../api";
import {
  EnrichedAlbum,
  EnrichedAlbumFile,
  enrichAlbums,
  enrichAlbumFiles,
  getAudio,
  getAlbum,
} from "../db";
import {
  artistsForFind,
  albumsForFind,
  artistCollection,
  albumCollection,
  audioCollection,
} from "../";

const options = { limit: 4, key: "name", threshold: -50 };

type ArtistAlbum = {
  id: string;
  name: string;
  url: string;
  coverUrl?: string;
  year?: number | null;
};

export type Artist = Omit<ArtistWithAlbums, "albums"> & {
  albums: EnrichedAlbum[];
};

const byYear = (a: ArtistAlbum, b: ArtistAlbum) => Number(a.year) - Number(b.year);

app.get("/find/:query", async (req: Request<{ query: string }>, res) => {
  const { query } = req.params;

  const foundArtists = fuzzysort.go(query, artistsForFind, options);
  const artists = await Promise.all(
    foundArtists.map((a) => a.obj).map(({ id }) => getArtistAlbums(id))
  );
  const foundAlbums = fuzzysort.go(query, albumsForFind, options);
  const albums = await Promise.all(foundAlbums.map((a) => a.obj).map(({ id }) => getAlbumById(id)));
  const foundAudios = fuzzysort.go(query, Object.values(audioCollection), options);
  const audios = await Promise.all(foundAudios.map((a) => a.obj).map(({ id }) => getAudioById(id)));

  res.status(200).json({
    artists,
    albums,
    audios,
  });
});

const getArtistAlbums = async (id: string): Promise<Artist> => {
  const artist = artistCollection[id];

  if (!artist) {
    // @ts-expect-error return empty
    return [];
  }

  const albums = await enrichAlbums(albumCollection, artist);
  const files = await Promise.all(
    artist.files.map(async (file) => {
      const dbAudio = await getAudio(file.id);
      const name = dbAudio?.metadata?.title || file.name;
      const trackNo = `${dbAudio?.metadata?.track?.no || ""}`;
      const diskNo = `${dbAudio?.metadata?.disk?.no || ""}`;
      const track = `${diskNo ? `${diskNo}.` : ""}${trackNo.padStart(2, "0")}`;

      return {
        ...file,
        name,
        track: track === "00" ? null : track,
        metadata: dbAudio?.metadata,
      };
    })
  );

  return {
    ...artist,
    albums: albums.sort(byYear),
    files,
  };
};

export type AlbumWithFilesAndMetadata = Omit<AlbumWithFiles, "files"> & {
  metadata: Metadata;
  files: EnrichedAlbumFile[];
};

const getAlbumById = async (id: string): Promise<AlbumWithFilesAndMetadata> => {
  const album = albumCollection[id];

  if (!album) {
    // @ts-expect-error return empty
    return {};
  }

  const dbAlbum = await getAlbum(id);
  const files = await enrichAlbumFiles(album);

  return {
    ...album,
    metadata: dbAlbum?.metadata,
    files,
  };
};

export type AudioWithMetadata = FileWithInfo & {
  track: string | null;
  coverUrl?: string;
  metadata: Metadata;
};

const getAudioById = async (id: string): Promise<AudioWithMetadata> => {
  const audio = audioCollection[id];

  if (!audio) {
    // @ts-expect-error return empty
    return {};
  }

  const album = albumCollection[audio.albumId as string];
  const dbAudio = await getAudio(id);
  const name = dbAudio?.metadata?.title || audio.name;
  const trackNo = `${dbAudio?.metadata?.track?.no || ""}`;
  const diskNo = `${dbAudio?.metadata?.disk?.no || ""}`;
  const track = `${diskNo ? `${diskNo}.` : ""}${trackNo.padStart(2, "0")}`;

  return {
    ...audio,
    name,
    track: track === "00" ? null : track,
    fileUrl: audio.url,
    coverUrl: album?.coverUrl,
    metadata: dbAudio?.metadata,
  };
};
