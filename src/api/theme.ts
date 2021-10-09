import { Request } from "express";
import { UrlSafeBase64 } from "musa-core";
import { app } from "../api";
import { getTheme, insertTheme, updateTheme } from "../db";

app.get("/theme/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const theme = await getTheme(id);

  if (!theme) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json({
    colors: theme.colors,
  });
});

app.put("/theme/:id", async (req: Request<{ id: string }, unknown, { colors: unknown }>, res) => {
  const { id } = req.params;
  const { colors } = req.body;
  const filename = UrlSafeBase64.decode(id);
  const settings = await getTheme(id);

  if (!settings) {
    await insertTheme({ id, filename, colors });

    res.status(201).json({ colors });
    return;
  }

  await updateTheme({ id, filename, colors });

  res.status(200).json({ colors });
});
