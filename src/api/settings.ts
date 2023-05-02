import { Request } from "express";

import { app } from "../api";
import { Fs, State } from "../musa-core-import";

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "local";

app.get("/app-settings", async (req, res) => {
  const { currentProfile } = req.query;
  const stateFile = `${isDev ? ".dev" : ""}${`.${currentProfile}` || ""}.musa-server.state.v1.json`;
  const settings = await Fs.getState(stateFile);

  if (!settings) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(settings);
});

app.put("/app-settings", async (req: Request<unknown, unknown, { settings: State }>, res) => {
  const { currentProfile } = req.query;
  const stateFile = `${isDev ? ".dev" : ""}${`.${currentProfile}` || ""}.musa-server.state.v1.json`;
  const { settings } = req.body;

  await Fs.setState(stateFile, settings);

  res.status(200).json(settings);
});
