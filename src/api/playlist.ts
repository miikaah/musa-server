import { Request } from "express";

import { app } from "../express";
import { Api, Tailscale } from "../musa-core-import";

app.get("/playlists/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  let playlist;
  try {
    playlist = await Api.getPlaylist(id);
  } catch {
    res.status(404).json({ error: "Not Found" });
    return;
  }

  res.status(200).json(playlist);
});

app.get("/playlists/:id/audios", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getAudiosByPlaylistId({ playlistId: id }));
});

app.post(
  "/playlists",
  async (req: Request<unknown, unknown, { pathIds: string[] }>, res) => {
    const { pathIds } = req.body;
    const ip = req.ip.split(":").pop() ?? "";
    const currentProfile = await Tailscale.getCurrentProfileByIp(ip);

    res
      .status(201)
      .json(await Api.insertPlaylist({ pathIds, createdByUserId: currentProfile }));
  },
);
