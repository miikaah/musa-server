import { Request } from "express";

import { app } from "../express";
import { Api } from "../musa-core-import";

app.get("/audios/:id", async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;

  const audio = await Api.findAudioById({ id });
  if (!audio) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.status(200).json(audio);
});
