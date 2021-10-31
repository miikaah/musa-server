import { Request } from "express";
import { Api, DbTheme } from "musa-core";
import { app } from "../api";

app.get("/themes", async (_req, res) => {
  const themes = await Api.getAllThemes();

  res.status(200).json(themes.map(toApiTheme));
});

app.get("/theme/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const theme = await Api.getTheme(id);

  if (!theme) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(toApiTheme(theme));
});

app.put("/theme/:id", async (req: Request<{ id: string }, unknown, { colors: unknown }>, res) => {
  const { id } = req.params;
  const { colors } = req.body;

  const newTheme = await Api.insertTheme(id, colors);

  res.status(201).json(toApiTheme(newTheme));
});

app.delete("/theme/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  await Api.removeTheme(id);

  res.status(204).send();
});

function toApiTheme({ path_id, filename, colors }: DbTheme) {
  return { id: path_id, filename, colors };
}
