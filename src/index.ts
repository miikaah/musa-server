import { app } from "./api";
import {
  traverseFileSystem,
  createMediaCollection,
  ArtistCollection,
  AlbumCollection,
  FileCollection,
} from "musa-core";
import { startScanner } from "./scanner-child";

const { NODE_ENV, MUSA_SRC_PATH = "", PORT = 4200, MUSA_BASE_URL } = process.env;

export const baseUrl = `${MUSA_BASE_URL}:${PORT}`;

export let files: string[] = [];
export let artistCollection: ArtistCollection = {};
export let albumCollection: AlbumCollection = {};
export let audioCollection: FileCollection = {};
export let imageCollection: FileCollection = {};

type ArtistObject = {
  [label: string]: { id: string; name: string; url: string }[];
};
export let artistObject: ArtistObject;

const logOpStart = (title: string) => {
  console.log(title);
  console.log("----------------------");
};

const logOpReport = (start: number, collection: string[], name: string) => {
  console.log(`Took: ${(Date.now() - start) / 1000} seconds`);
  console.log(`Found: ${collection.length} ${name}`);
  console.log("----------------------\n");
};

const start = async () => {
  if (NODE_ENV === "test") {
    return;
  }

  const totalStart = Date.now();

  logOpStart("Traversing file system");
  let start = Date.now();
  files = await traverseFileSystem(MUSA_SRC_PATH);
  logOpReport(start, files, "files");

  logOpStart("Creating media collection");
  start = Date.now();
  const { artistsCol, albumsCol, audioCol, imagesCol } = createMediaCollection(files, baseUrl);
  artistCollection = artistsCol;
  albumCollection = albumsCol;
  audioCollection = audioCol;
  imageCollection = imagesCol;

  artistObject = Object.entries(artistCollection)
    .map(([id, { name, url }]) => ({ id, name, url }))
    .reduce((acc: ArtistObject, artist) => {
      const { name } = artist;
      const label = name.charAt(0);

      return {
        ...acc,
        [label]: [...(acc[label] || []), artist],
      };
    }, {});

  console.log(`Took: ${(Date.now() - start) / 1000} seconds`);
  console.log(`Found: ${Object.keys(artistCollection).length} artists`);
  console.log(`Found: ${Object.keys(albumCollection).length} albums`);
  console.log(`Found: ${Object.keys(audioCollection).length} songs`);
  console.log(`Found: ${Object.keys(imageCollection).length} images`);
  console.log("----------------------\n");

  app.listen(PORT, async () => {
    logOpStart("Startup Report");
    console.log(`Took: ${(Date.now() - totalStart) / 1000} seconds total`);
    console.log("----------------------\n");
    console.log(`Serving ${baseUrl}\n`);

    startScanner();
  });
};

start();
