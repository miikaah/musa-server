import { app } from "../express";
import { Api } from "../musa-core-import";

app.get("/genres", async (_req, res) => {
  res.status(200).json(await Api.getAllGenres());
});
