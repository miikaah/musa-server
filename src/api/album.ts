import { Request } from "express";

import { app } from "../express";
import { Api } from "../musa-core-import";

app.get("/albums/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  const album = await Api.findAlbumById(id);
  if (!album) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.status(200).json(album);
});
