import express, { Request } from "express";
import fuzzysort from "fuzzysort";
import UrlSafeBase64 from "./urlsafe-base64";
import { traverseFileSystem } from "./fs";
import {
  createMediaCollection,
  ArtistCollection,
  AlbumCollection,
  FileCollection,
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

      return {
        path,
        id: UrlSafeBase64.encode(path),
      };
    });

    res.status(200).json({ results });

    return;
  }

  res.status(200).json({ results: [] });
});

app.get("/file/:name", (req: Request<{ name: string }>, res, next) => {
  const { name } = req.params;
  const filename = UrlSafeBase64.decode(name);
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

let artistCollection: ArtistCollection = {};
let albumCollection: AlbumCollection = {};
let songCollection: FileCollection = {};
let imageCollection: FileCollection = {};

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
  files = await traverseFileSystem(srcPath);
  logOpReport(start, files, "files");

  logOpStart("Creating media collection");
  start = Date.now();
  const { artistsCol, albumsCol, songsCol, imagesCol } = createMediaCollection(files);
  artistCollection = artistsCol;
  albumCollection = albumsCol;
  songCollection = songsCol;
  imageCollection = imagesCol;
  console.log(`Took: ${(Date.now() - start) / 1000} seconds`);
  console.log(`Found: ${Object.keys(artistCollection).length} artists`);
  console.log(`Found: ${Object.keys(albumCollection).length} albums`);
  console.log(`Found: ${Object.keys(songCollection).length} songs`);
  console.log(`Found: ${Object.keys(imageCollection).length} images`);
  console.log("----------------------\n");

  app.listen(PORT, () => {
    logOpStart("Startup Report");
    console.log(`Took: ${(Date.now() - totalStart) / 1000} seconds total`);
    console.log("----------------------\n");

    console.log(`Serving http://localhost:${PORT}\n`);
  });
};

start();
