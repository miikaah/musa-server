import express, { Request } from "express";
import fuzzysort from "fuzzysort";
import UrlSafeBase64 from "./urlsafe-base64";
import { files } from "./";

const { MUSA_SRC_PATH = "" } = process.env;

export const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello");
});

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
    root: MUSA_SRC_PATH,
  };
  console.log(filename);

  res.sendFile(filename, options, (err) => {
    if (err) {
      next(err);
    }
  });
});
