import { Request } from "express";
import { app } from "../api";
import { getSettings, insertSettings, updateSettings } from "../db";

app.get("/settings", async (_req, res) => {
  const settings = await getSettings();

  if (!settings) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(settings.json);
});

app.put("/settings", async (req: Request<unknown, unknown, { settings: unknown }>, res) => {
  const { settings: json } = req.body;
  const settings = await getSettings();

  if (!settings) {
    await insertSettings(json);

    res.status(201).json(json);
    return;
  }

  await updateSettings(json);

  res.status(200).json(json);
});
