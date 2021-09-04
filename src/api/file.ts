import { app } from "../api";
import { Request } from "express";
import UrlSafeBase64 from "../urlsafe-base64";

const { NODE_ENV, MUSA_SRC_PATH = "" } = process.env;

app.get("/file/:name", (req: Request<{ name: string }>, res, next) => {
  const { name } = req.params;
  const filename = UrlSafeBase64.decode(name);
  const options = {
    root: MUSA_SRC_PATH,
  };

  if (NODE_ENV !== "test") {
    console.log(filename);
  }

  res.sendFile(filename, options, (err) => {
    if (err) {
      next(err);
    }
  });
});