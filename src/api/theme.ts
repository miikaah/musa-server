import { Request } from "express";

import { Api } from "../musa-core-import";
import { app } from "../api";

app.get("/themes", async (_req, res) => {
  res.status(200).json(await Api.getAllThemes());
});

app.get("/themes/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getTheme(id));
});

app.put("/themes/:id", async (req: Request<{ id: string }, unknown, { colors: unknown }>, res) => {
  const { id } = req.params;
  const { colors } = req.body;

  res.status(201).json(await Api.insertTheme(id, colors));
});

app.delete("/themes/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  await Api.removeTheme(id);

  res.status(204).send();
});
