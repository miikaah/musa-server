import path, { sep, ParsedPath } from "path";
import { imageExts } from "./fs";
import UrlSafeBase64 from "./urlsafe-base64";

export type MediaCollection = {
  artistsCol: ArtistCollection;
  albumsCol: AlbumCollection;
  audioCol: FileCollection;
  imagesCol: FileCollection;
};

export type ArtistCollection = {
  [x: string]: ArtistWithAlbums;
};

export type File = {
  id: string;
  name: string;
  url: string;
  fileUrl?: string;
};

export type AlbumFile = File & {
  coverUrl?: string;
  // Used for artist metadata creation
  firstAlbumAudio?: {
    id: string;
    name: string;
  };
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

export type AlbumWithFiles = {
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
  albumId?: string;
  albumName?: string;
  albumUrl?: string;
  albumCoverUrl?: string;
};

export const createMediaCollection = (files: string[], baseUrl: string): MediaCollection => {
  const artistsCol: ArtistCollection = {};
  const albumsCol: AlbumCollection = {};
  const audioCol: FileCollection = {};
  const imagesCol: FileCollection = {};

  const albumSet = new Set();

  for (const file of files) {
    const [artistName, ...rest] = file.split(sep);
    const artistId = UrlSafeBase64.encode(artistName);
    const artistUrl = getUrl(baseUrl, "artist", artistId);
    const fileId = UrlSafeBase64.encode(file);
    const audioUrl = getUrl(baseUrl, "audio", fileId);
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
          id: fileId,
          name,
          artistName,
          artistUrl,
          url,
          fileUrl: url,
        };

        if (isImage(name)) {
          artistsCol[artistId].images.push({
            id: fileId,
            name,
            url: imageUrl,
            fileUrl: url,
          });
          imagesCol[fileId] = fileWithInfo;
        } else {
          artistsCol[artistId].files.push({
            id: fileId,
            name,
            url: audioUrl,
            fileUrl: url,
          });
          audioCol[fileId] = fileWithInfo;
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
        artistsCol[artistId].albums.push({
          id: albumId,
          name: albumName,
          url: albumUrl,
        });
      }

      const fileWithInfo = {
        id: fileId,
        name: fileName,
        artistName,
        artistUrl,
        albumId,
        albumName,
        albumUrl,
        url,
      };

      if (isImage(fileName)) {
        albumsCol[albumId].images.push({
          id: fileId,
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
          id: fileId,
          name: fileName,
          url: audioUrl,
          fileUrl: url,
        });
        audioCol[fileId] = fileWithInfo;
      }
    }
  }

  // Second pass for enriching artist album lists with missing album covers
  // and first album audios needed for artist metadata creation
  Object.keys(artistsCol).forEach((key) => {
    artistsCol[key].albums.forEach((a) => {
      const id = a.url.split("/").pop() || "";
      const files = albumsCol[id].files;

      // This code has to be here before early return
      if (!a.firstAlbumAudio && typeof files[0] === "object") {
        const { id, name } = files[0];
        a.firstAlbumAudio = { id, name };
      }

      if (a.coverUrl) {
        return;
      }

      const images = albumsCol[id].images;

      // Find an image with a default name
      for (const img of images) {
        if (isDefaultNameImage(img.name)) {
          const { fileUrl } = img;

          a.coverUrl = fileUrl;
          albumsCol[id].coverUrl = fileUrl;
          break;
        }
      }

      // Take the first image
      if (!a.coverUrl && images.length) {
        const { fileUrl } = images[0];

        a.coverUrl = fileUrl;
        albumsCol[id].coverUrl = fileUrl;
      }
    });
  });

  return { artistsCol, albumsCol, audioCol, imagesCol };
};

const getUrl = (baseUrl: string, path: string, id: string): string => {
  return `${baseUrl}/${path}/${id}`;
};

const isImage = (filename: string) => {
  return imageExts.some((e) => filename.toLowerCase().endsWith(e));
};

const isAlbumCoverImage = (albumName: string, img: ParsedPath): boolean => {
  return albumName.toLowerCase().includes(img.name.toLowerCase());
};

const isDefaultNameImage = (pic: string) => {
  const s = pic.toLowerCase();
  return s.includes("front") || s.includes("cover") || s.includes("_large") || s.includes("folder");
};
