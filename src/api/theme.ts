import { Request } from "express";
import { Api } from "musa-core";

import { app } from "../api";

app.get("/themes", async (_req, res) => {
  res.status(200).json(await Api.getAllThemes());
});

app.get("/theme/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getTheme(id));
});

app.put("/theme/:id", async (req: Request<{ id: string }, unknown, { colors: unknown }>, res) => {
  const { id } = req.params;
  const { colors } = req.body;

  res.status(201).json(await Api.insertTheme(id, colors));
});

app.delete("/theme/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  await Api.removeTheme(id);

  res.status(204).send();
});
