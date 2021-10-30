import { Request } from "express";
import { Api } from "musa-core";
import { app } from "../api";

app.get("/find/:query", async (req: Request<{ query: string }>, res) => {
  const { query } = req.params;

  res.status(200).json(await Api.find({ query }));
});

app.get("/find-random", async (_req, res) => {
  res.status(200).json(await Api.findRandom());
});
