import { Request } from "express";
import { UrlSafeBase64 } from "../musa-core-import";

import { app } from "../api";

const { NODE_ENV, MUSA_SRC_PATH = "" } = process.env;

const options = {
  root: MUSA_SRC_PATH,
};

app.get("/files/:name", (req: Request<{ name: string }>, res, next) => {
  const { name } = req.params;
  const filename = UrlSafeBase64.decode(name);

  if (NODE_ENV !== "test") {
    console.log(filename);
  }

  res.sendFile(filename, options, (err) => {
    if (err?.message === "Not Found") {
      res.status(404).json({ message: "Not Found" });
    } else if (err) {
      next(err);
    }
  });
});
