import { app } from "../api";
import { Request } from "express";
import { songCollection } from "../";

app.get("/song/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const song = songCollection[id];

  if (!song) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(song);
});
