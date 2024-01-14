import { Request } from "express";
import fs, { Stats } from "fs";
import fsp from "fs/promises";
import path from "path";
import { UrlSafeBase64 } from "../musa-core-import";
import { app } from "../express";
import { cacheControlMiddleware } from "../cacheControlMiddleware";

const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 183;
const { MUSA_SRC_PATH = "" } = process.env;

const options = {
  root: MUSA_SRC_PATH,
};

const parseRange = (range: string | undefined): [string, number, number] | undefined => {
  if (!range) {
    return;
  }
  const [type, r] = range.split("=");
  const ranges = r.split(",")
    .filter((rr): rr is string => typeof rr === "string")
    .map((rr) => rr.trim());
  const [start, end] = ranges[0].split("-");

  return [type, Number(start), Number(end)];
}

app.get(
  "/files/:name",
  cacheControlMiddleware(SIX_MONTHS_IN_SECONDS),
  async (req: Request<{ name: string }>, res, next) => {
    const { name } = req.params;
    const filename = UrlSafeBase64.decode(name);
    // const range = req.headers["range"];

    // if (range) {
    //   const parsedRange = parseRange(range);
    //   if (!parsedRange) {
    //     console.error("Invalid parsed range");
    //     res.status(500).end();
    //     return;
    //   }

    //   const [type, start, end] = parsedRange;
    //   const size = end ? end - start : start;
    //   console.log("resume!", range, size, start, end);
    //   const filepath = path.join(MUSA_SRC_PATH, filename);
    //   const stat = await fsp.stat(filepath);
    //   const len = stat.size - size;
    //   const stream = fs.createReadStream(filepath);
    //   res.setHeader("Accept-Ranges", type);
    //   res.setHeader("Content-Type", "audio/mpeg");
    //   res.setHeader("Content-Length", len);
    //   res.setHeader("Content-Range", `${type} ${range ? `${start}-${end || len - 1}` : "*"}/${len}`);
    //   res.setHeader("Last-Modified", stat.mtime.toISOString());
    //   stream.pipe(res);
    //   return;
    // }

    res.sendFile(filename, options, (err) => {
      if (err?.message.includes("ENOENT")) {
        res.status(404).json({ message: "Not Found" });
      } else if (err) {
        next(err);
      }
    });
  },
);
