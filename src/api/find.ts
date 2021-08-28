import { app } from "../api";
import { Request } from "express";
import fuzzysort from "fuzzysort";
import UrlSafeBase64 from "../urlsafe-base64";
import { files } from "../";

app.get("/find/files/:name", (req: Request<{ name: string }>, res) => {
  const { name } = req.params;
  const limit = 50;

  const foundFiles = fuzzysort.go(name, files, { limit, threshold: -999 });
  const { total } = foundFiles;

  if (total) {
    const results = foundFiles.map((f) => {
      const { target: path } = f;

      return {
        path,
        id: UrlSafeBase64.encode(path),
      };
    });

    res.status(200).json({ results, limit, total });

    return;
  }

  res.status(200).json({ results: [], limit, total: 0 });
});
