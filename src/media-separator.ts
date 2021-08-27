import { sep } from "path";
import { audioExts, imageExts } from "./fs";
import { inspect } from "util";
import UrlSafeBase64 from "urlsafe-base64";

export const separateArtists = (files: string[]): string[] => {
  const artists = new Set<string>();

  for (const f of files) {
    artists.add(f.split(sep)[0]);
  }

  return Array.from(artists);
};

export const separateAlbums = (files: string[]): string[] => {
  const albums = new Set<string>();

  for (const f of files) {
    const album = f.split(sep);
    album.splice(album.length - 1, 1);
    albums.add(album.join(sep));
  }

  return Array.from(albums);
};

export const separateSongs = (files: string[]): string[] => {
  return files.filter((f) => audioExts.some((e) => f.toLowerCase().endsWith(e)));
};

export const separateImages = (files: string[]): string[] => {
  return files.filter((f) => imageExts.some((e) => f.toLowerCase().endsWith(e)));
};

export type Artist = {
  id: string;
  name: string;
  albums: {
    [x: string]: Album;
  };
  files: File[];
};

export type Album = {
  id: string;
  name: string;
  files: File[];
};

export type File = {
  id: string;
  name: string;
};

export type ArtistCollection = {
  [x: string]: Artist;
};

export const createArtistCollection = (files: string[]): ArtistCollection => {
  const map: ArtistCollection = {};

  for (const file of files) {
    const [artistName, ...rest] = file.split(sep);

    if (!map[artistName]) {
      map[artistName] = {
        id: encodeToUrlSafeBase64(artistName),
        name: artistName,
        albums: {},
        files: [],
      };
    }

    if (rest.length === 1) {
      map[artistName].files.push(
        ...rest.map((r) => ({
          id: encodeToUrlSafeBase64(file),
          name: r,
        }))
      );
    } else {
      const [albumName, ...albumRest] = rest;

      if (!map[artistName].albums) {
        map[artistName].albums = {};
      }

      if (!map[artistName].albums[albumName]) {
        map[artistName].albums[albumName] = {
          id: encodeToUrlSafeBase64(albumName),
          name: albumName,
          files: [],
        };
      }
      map[artistName].albums[albumName].files.push({
        id: encodeToUrlSafeBase64(file),
        name: albumRest[albumRest.length - 1],
      });
    }
  }
  console.log(inspect(map["CMX"], false, 10, true));

  return map;
};

const encodeToUrlSafeBase64 = (s: string) => {
  return UrlSafeBase64.encode(Buffer.from(s));
};
