import express, { Request } from "express";
import fuzzysort from "fuzzysort";
import UrlSafeBase64 from "urlsafe-base64";
import { traverseFileSystem } from "./fs";
import {
  separateArtists,
  separateAlbums,
  separateSongs,
  separateImages,
  createArtistCollection,
  ArtistCollection,
} from "./media-separator";

const PORT = process.env.PORT || 4200;
const { NODE_ENV, MUSA_SRC_PATH } = process.env;
const srcPath = MUSA_SRC_PATH || "";

export const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello");
});

let files: string[] = [];
app.get("/find/files/:name", (req: Request<{ name: string }>, res) => {
  const { name } = req.params;

  const foundFiles = fuzzysort.go(name, files, { limit: 50, threshold: -999 });

  if (foundFiles.total) {
    const results = foundFiles.map((f) => {
      const { target: path } = f;
      const buf = Buffer.from(path);

      return {
        path,
        base64: UrlSafeBase64.encode(buf),
      };
    });

    res.status(200).json({ results });

    return;
  }

  res.status(200).json({ results: [] });
});

app.get("/file/:name", (req: Request<{ name: string }>, res, next) => {
  const { name } = req.params;
  const filename = UrlSafeBase64.decode(name).toString("utf-8");
  const options = {
    root: srcPath,
  };
  console.log(filename);

  res.sendFile(filename, options, (err) => {
    if (err) {
      next(err);
    }
  });
});

let artists: string[] = [];
let albums: string[] = [];
let songs: string[] = [];
let images: string[] = [];

let artistCollection: ArtistCollection = {};

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
  const totalStart = Date.now();

  logOpStart("Traversing file system");
  let start = Date.now();
  files = await traverseFileSystem(srcPath);
  logOpReport(start, files, "files");

  logOpStart("Separating artists from files");
  start = Date.now();
  artists = separateArtists(files);
  logOpReport(start, artists, "artists");

  logOpStart("Separating albums from files");
  start = Date.now();
  albums = separateAlbums(files);
  logOpReport(start, albums, "albums");

  logOpStart("Separating songs from files");
  start = Date.now();
  songs = separateSongs(files);
  logOpReport(start, songs, "songs");

  logOpStart("Separating images from files");
  start = Date.now();
  images = separateImages(files);
  logOpReport(start, images, "images");

  logOpStart("Creating artist collection");
  start = Date.now();
  artistCollection = createArtistCollection(files);
  console.log(`Took: ${(Date.now() - start) / 1000} seconds`);
  console.log("----------------------\n");

  if (NODE_ENV !== "test") {
    app.listen(PORT, () => {
      logOpStart("Startup Report");
      console.log(`Took: ${(Date.now() - totalStart) / 1000} seconds total`);
      console.log("----------------------\n");

      console.log(`Serving http://localhost:${PORT}`);
    });
  }
};

start();
