import { Request } from "express";
import { Api } from "musa-core";
import { app } from "../api";

app.get("/audio/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  await Api.getAudioById({ id });

  res.status(200).json(await Api.getAudioById({ id }));
});
