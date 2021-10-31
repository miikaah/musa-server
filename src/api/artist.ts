import { Request } from "express";
import { Api } from "musa-core";
import { app } from "../api";

app.get("/artist/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getArtistById(id));
});

app.get("/artists", async (_req, res) => {
  res.status(200).json(await Api.getArtists());
});

app.get("/artist-albums/:id", async (req, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getArtistAlbums(id));
});
