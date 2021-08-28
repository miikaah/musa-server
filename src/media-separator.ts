import path, { sep } from "path";
import { imageExts } from "./fs";
import UrlSafeBase64 from "./urlsafe-base64";

export type MediaCollection = {
  artistsCol: ArtistCollection;
  albumsCol: AlbumCollection;
  songsCol: FileCollection;
  imagesCol: FileCollection;
};

export type ArtistCollection = {
  [x: string]: ArtistWithAlbums;
};

type File = {
  name: string;
  url: string;
};

type ArtistWithAlbums = {
  name: string;
  albums?: File[];
  files: File[];
  images: File[];
};

export type AlbumCollection = {
  [x: string]: AlbumWithFiles;
};

type AlbumWithFiles = {
  artistName: string;
  artistUrl: string;
  name: string;
  files: File[];
  images: File[];
};

export type FileCollection = {
  [x: string]: FileWithInfo;
};

type FileWithInfo = {
  name: string;
  artistName: string;
  artistUrl: string;
  albumName?: string;
  albumUrl?: string;
  url: string;
};

const isImage = (filename: string) => {
  return imageExts.some((e) => filename.toLowerCase().endsWith(e));
};

export const createMediaCollection = (files: string[], baseUrl: string): MediaCollection => {
  const artistsCol: ArtistCollection = {};
  const albumsCol: AlbumCollection = {};
  const songsCol: FileCollection = {};
  const imagesCol: FileCollection = {};

  const albumSet = new Set();

  for (const file of files) {
    const [artistName, ...rest] = file.split(sep);
    const artistId = UrlSafeBase64.encode(artistName);
    const artistUrl = getUrl(baseUrl, "artist", artistId);
    const fileId = UrlSafeBase64.encode(file);
    const songUrl = getUrl(baseUrl, "song", fileId);
    const imageUrl = getUrl(baseUrl, "image", fileId);
    const url = getUrl(baseUrl, "file", fileId);

    if (!artistsCol[artistId]) {
      artistsCol[artistId] = {
        name: artistName,
        albums: [],
        files: [],
        images: [],
      };
    }

    if (rest.length === 1) {
      rest.forEach((name) => {
        const fileWithInfo = {
          name,
          artistName,
          artistUrl,
          url,
        };

        if (isImage(name)) {
          artistsCol[artistId].images.push({
            name,
            url: imageUrl,
          });
          imagesCol[fileId] = fileWithInfo;
        } else {
          artistsCol[artistId].files.push({
            name,
            url: songUrl,
          });
          songsCol[fileId] = fileWithInfo;
        }
      });
    } else {
      const [albumName, ...albumRest] = rest;
      const albumId = UrlSafeBase64.encode(path.join(artistName, albumName));
      const albumUrl = getUrl(baseUrl, "album", albumId);
      const fileName = albumRest[albumRest.length - 1];

      if (!albumsCol[albumId]) {
        albumsCol[albumId] = {
          name: albumName,
          artistName,
          artistUrl,
          files: [],
          images: [],
        };
      }

      if (!albumSet.has(albumUrl)) {
        albumSet.add(albumUrl);
        // @ts-expect-error it's not undefined
        artistsCol[artistId].albums.push({
          name: albumName,
          url: albumUrl,
        });
      }

      const fileWithInfo = {
        name: fileName,
        artistName,
        artistUrl,
        albumName,
        albumUrl,
        url,
      };
      if (isImage(fileName)) {
        albumsCol[albumId].images.push({
          name: fileName,
          url: imageUrl,
        });
        imagesCol[fileId] = fileWithInfo;
      } else {
        albumsCol[albumId].files.push({
          name: fileName,
          url: songUrl,
        });
        songsCol[fileId] = fileWithInfo;
      }
    }
  }

  return { artistsCol, albumsCol, songsCol, imagesCol };
};

const getUrl = (baseUrl: string, path: string, id: string): string => {
  return `${baseUrl}/${path}/${id}`;
};
