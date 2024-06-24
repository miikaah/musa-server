import { Request } from "express";

import { app } from "../express";
import { Api, Colors } from "../musa-core-import";

app.get("/themes", async (_req, res) => {
  res.status(200).json(await Api.getAllThemes());
});

app.get("/themes/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  let theme;
  try {
    theme = await Api.getTheme(id);
  } catch (error) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(theme);
});

app.put(
  "/themes/:id",
  async (req: Request<{ id: string }, unknown, { colors: Colors }>, res) => {
    const { id } = req.params;
    const { colors } = req.body;

    res.status(201).json(await Api.insertTheme(id, colors));
  },
);

app.patch(
  "/themes/:id",
  async (req: Request<{ id: string }, unknown, { colors: Colors }>, res) => {
    const { id } = req.params;
    const { colors } = req.body;

    res.status(200).json(await Api.updateTheme(id, colors));
  },
);

app.delete("/themes/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  await Api.removeTheme(id);

  res.status(204).send();
});
