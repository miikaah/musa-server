import { Request } from "express";

import { app } from "../express";
import { Api } from "../musa-core-import";

app.get("/artists/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getArtistById(id));
});

app.get("/artists", async (_req, res) => {
  res.status(200).json(await Api.getArtists());
});

app.get("/artists/:id/albums", async (req, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getArtistAlbums(id));
});
