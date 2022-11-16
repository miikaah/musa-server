import { Request } from "express";

import { app } from "../api";
import { Fs, State } from "../musa-core-import";

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "local";
const stateFile = `${isDev ? ".dev" : ""}.musa-server.state.v1.json`;

app.get("/settings", async (_req, res) => {
  const settings = await Fs.getState(stateFile);

  if (!settings) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(settings);
});

app.put("/settings", async (req: Request<unknown, unknown, { settings: State }>, res) => {
  const { settings } = req.body;

  await Fs.setState(stateFile, settings);

  res.status(200).json(settings);
});
