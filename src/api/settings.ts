import { Request } from "express";
import { Fs, State } from "@miikaah/musa-core";

import { app } from "../api";

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "local";
const stateFile = `${isDev ? ".dev" : ""}.musa-server.state.v1.json`;

app.get("/state", async (_req, res) => {
  const settings = await Fs.getState(stateFile);

  if (!settings) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(settings);
});

app.put("/state", async (req: Request<unknown, unknown, { settings: State }>, res) => {
  const { settings } = req.body;

  await Fs.setState(stateFile, settings);

  res.status(200).json(settings);
});
