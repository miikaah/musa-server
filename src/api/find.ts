import { Request } from "express";

import { app } from "../api";
import { Api } from "../musa-core-import";

app.get("/find/:query", async (req: Request<{ query: string }>, res) => {
  const { query } = req.params;

  res.status(200).json(await Api.find({ query, limit: 32 }));
});

app.get("/find-random", async (_req, res) => {
  res.status(200).json(await Api.findRandom({ limit: 7 }));
});

app.get("/find-random/:query", async (req, res) => {
  const { query } = req.params;

  res.status(200).json(await Api.findRandom({ limit: 7, lockedSearchTerm: query }));
});
