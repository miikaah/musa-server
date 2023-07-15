import { Request } from "express";

import { app } from "../express";
import { Fs, State, Tailscale } from "../musa-core-import";

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "local";

const getStateFilename = (currentProfile?: string) => {
  return `${isDev ? ".dev" : ""}.musa-server.state.v1${
    currentProfile ? `.user-${currentProfile}` : ""
  }.json`;
};

app.get("/app-settings", async (req, res) => {
  const ip = req.ip.split(":").pop() ?? "";
  const currentProfile = await Tailscale.getCurrentProfileByIp(ip);
  const stateFile = getStateFilename(currentProfile);
  const settings = await Fs.getState(stateFile);

  if (!settings) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json({
    ...settings,
    currentProfile,
  });
});

app.put(
  "/app-settings",
  async (req: Request<unknown, unknown, { settings: State }>, res) => {
    const ip = req.ip.split(":").pop() ?? "";
    const currentProfile = await Tailscale.getCurrentProfileByIp(ip);
    const stateFile = getStateFilename(currentProfile);
    const { settings } = req.body;

    await Fs.setState(stateFile, settings);

    res.status(200).json({
      ...settings,
      currentProfile,
    });
  },
);
