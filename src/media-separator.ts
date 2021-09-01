import path, { sep, ParsedPath } from "path";
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

export type File = {
  name: string;
  url: string;
  fileUrl: string;
};

type AlbumFile = File & {
  coverUrl: string;
};

type ArtistWithAlbums = {
  url: string;
  name: string;
  albums: AlbumFile[];
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
  coverUrl?: string;
};

export type FileCollection = {
  [x: string]: FileWithInfo;
};

type FileWithInfo = File & {
  artistName: string;
  artistUrl: string;
  albumName?: string;
  albumUrl?: string;
  albumCoverUrl?: string;
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
        url: artistUrl,
        name: artistName,
        albums: [],
        files: [],
        images: [],
      };
    }

    // First pass
    if (rest.length === 1) {
      // This file is in the artist folder
      rest.forEach((name) => {
        const fileWithInfo = {
          name,
          artistName,
          artistUrl,
          url,
          fileUrl: url,
        };

        if (isImage(name)) {
          artistsCol[artistId].images.push({
            name,
            url: imageUrl,
            fileUrl: url,
          });
          imagesCol[fileId] = fileWithInfo;
        } else {
          artistsCol[artistId].files.push({
            name,
            url: songUrl,
            fileUrl: url,
          });
          songsCol[fileId] = fileWithInfo;
        }
      });
    } else {
      // This file is in an album folder
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
        fileUrl: url,
      };

      if (isImage(fileName)) {
        albumsCol[albumId].images.push({
          name: fileName,
          url: imageUrl,
          fileUrl: url,
        });
        imagesCol[fileId] = fileWithInfo;

        const parsedFile = path.parse(fileName);
        if (isAlbumCoverImage(albumName, parsedFile)) {
          albumsCol[albumId].coverUrl = url;

          const albumIndex = artistsCol[artistId].albums.findIndex((a) => a.name === albumName);
          if (albumIndex > -1) {
            const album = artistsCol[artistId].albums[albumIndex];
            album.coverUrl = url;
          }
        }
      } else {
        albumsCol[albumId].files.push({
          name: fileName,
          url: songUrl,
          fileUrl: url,
        });
        songsCol[fileId] = fileWithInfo;
      }
    }
  }

  // Second pass for enriching artist album lists with missing album covers
  Object.keys(artistsCol).forEach((key) => {
    artistsCol[key].albums.forEach((a) => {
      if (a.coverUrl) {
        return;
      }

      const id = a.url.split("/").pop() || "";
      const images = albumsCol[id].images;

      // Find an image with a default name
      for (const img of images) {
        if (isDefaultNameImage(img.name)) {
          a.coverUrl = img.fileUrl;
          break;
        }
      }

      // Take the first image
      if (!a.coverUrl && images.length) {
        a.coverUrl = images[0].fileUrl;
      }
    });
  });

  return { artistsCol, albumsCol, songsCol, imagesCol };
};

const getUrl = (baseUrl: string, path: string, id: string): string => {
  return `${baseUrl}/${path}/${id}`;
};

const isAlbumCoverImage = (albumName: string, img: ParsedPath): boolean => {
  return albumName.toLowerCase().includes(img.name.toLowerCase());
};

const isDefaultNameImage = (pic: string) => {
  const s = pic.toLowerCase();
  return s.includes("front") || s.includes("cover") || s.includes("_large") || s.includes("folder");
};
