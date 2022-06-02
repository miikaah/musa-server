import { Request } from "express";

import { app } from "../api";
import { getState, setState, State } from "../fs.state";

app.get("/state", async (_req, res) => {
  const settings = await getState();

  if (!settings) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(settings);
});

app.put("/state", async (req: Request<unknown, unknown, { settings: State }>, res) => {
  const { settings } = req.body;

  await setState(settings);

  res.status(200).json(settings);
});
