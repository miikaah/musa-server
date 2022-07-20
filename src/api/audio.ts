import { Request } from "express";
import { Api } from "@miikaah/musa-core";

import { app } from "../api";

app.get("/audio/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  res.status(200).json(await Api.getAudioById({ id }));
});
