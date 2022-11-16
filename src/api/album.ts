import { Request } from "express";

import { app } from "../api";
import { Api } from "../musa-core-import";

app.get("/albums/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getAlbumById(id));
});
