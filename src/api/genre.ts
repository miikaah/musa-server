import { Api } from "../musa-core-import";
import { app } from "../api";

app.get("/genres", async (_req, res) => {
  res.status(200).json(await Api.getAllGenres());
});
