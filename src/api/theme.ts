import { Request } from "express";
import { Api } from "musa-core";
import { app } from "../api";

app.get("/themes", async (_req, res) => {
  const themes = await Api.getAllThemes();

  res.status(200).json({
    themes: themes.map(({ path_id, colors }) => ({
      id: path_id,
      colors,
    })),
  });
});

app.get("/theme/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const theme = await Api.getTheme(id);

  if (!theme) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json({
    id: theme.path_id,
    colors: theme.colors,
  });
});

app.put("/theme/:id", async (req: Request<{ id: string }, unknown, { colors: unknown }>, res) => {
  const { id } = req.params;
  const { colors } = req.body;

  const newTheme = await Api.insertTheme(id, colors);
  const { path_id } = newTheme;

  res.status(200).json({ id: path_id, colors });
});
