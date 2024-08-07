import { Request } from "express";
import { UrlSafeBase64 } from "../musa-core-import";

import { cacheControlMiddleware } from "../cacheControlMiddleware";
import { app } from "../express";

const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 183;
const { MUSA_SRC_PATH = "" } = process.env;

const options = {
  root: MUSA_SRC_PATH,
};

app.get(
  "/files/:name",
  cacheControlMiddleware(SIX_MONTHS_IN_SECONDS),
  (req: Request<{ name: string }>, res, next) => {
    const { name } = req.params;
    const filename = UrlSafeBase64.decode(name);

    res.sendFile(filename, options, (err) => {
      if (err?.message.includes("ENOENT")) {
        res.status(404).json({ message: "Not Found" });
      } else if (err) {
        next(err);
      }
    });
  },
);
