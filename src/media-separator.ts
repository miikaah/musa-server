import path, { sep } from "path";
import { imageExts } from "./fs";
import UrlSafeBase64 from "urlsafe-base64";

export type MediaCollection = {
  artistsCol: ArtistCollection;
  albumsCol: AlbumCollection;
  songsCol: FileCollection;
  imagesCol: FileCollection;
};

export type ArtistCollection = {
  [x: string]: ArtistWithAlbums;
};

type idNamePair = {
  [x: string]: string;
};

type ArtistWithAlbums = {
  name: string;
  albums?: idNamePair;
  files: idNamePair;
};

export type AlbumCollection = {
  [x: string]: AlbumWithFiles;
};

type AlbumWithFiles = {
  artistName: string;
  name: string;
  files: idNamePair;
};

export type FileCollection = {
  [x: string]: FileWithInfo;
};

type FileWithInfo = {
  name: string;
  artistName: string;
  artistId: string;
  albumName?: string;
  albumId?: string;
};

const isImage = (filename: string) => {
  return imageExts.some((e) => filename.toLowerCase().endsWith(e));
};

export const createMediaCollection = (files: string[]): MediaCollection => {
  const artistsCol: ArtistCollection = {};
  const albumsCol: AlbumCollection = {};
  const songsCol: FileCollection = {};
  const imagesCol: FileCollection = {};

  for (const file of files) {
    const [artistName, ...rest] = file.split(sep);
    const artistId = encodeToUrlSafeBase64(artistName);
    const fileId = encodeToUrlSafeBase64(file);

    if (!artistsCol[artistId]) {
      artistsCol[artistId] = {
        name: artistName,
        albums: {},
        files: {},
      };
    }

    if (rest.length === 1) {
      rest.forEach((name) => {
        const obj = {
          name,
          artistName,
          artistId,
        };
        if (isImage(name)) {
          imagesCol[fileId] = obj;
        } else {
          artistsCol[artistId].files[fileId] = name;
          songsCol[fileId] = obj;
        }
      });
    } else {
      const [albumName, ...albumRest] = rest;
      const albumId = encodeToUrlSafeBase64(path.join(artistName, albumName));
      const fileName = albumRest[albumRest.length - 1];

      if (!albumsCol[albumId]) {
        albumsCol[albumId] = {
          name: albumName,
          artistName,
          files: {},
        };
      }

      artistsCol[artistId].albums = {
        ...artistsCol[artistId].albums,
        [albumId]: albumName,
      };

      albumsCol[albumId].files[fileId] = fileName;

      const obj = {
        name: fileName,
        artistName,
        artistId,
        albumName,
        albumId,
      };
      if (isImage(fileName)) {
        imagesCol[fileId] = obj;
      } else {
        songsCol[fileId] = obj;
      }
    }
  }

  return { artistsCol, albumsCol, songsCol, imagesCol };
};

const encodeToUrlSafeBase64 = (s: string) => {
  return UrlSafeBase64.encode(Buffer.from(s));
};
