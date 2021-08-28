import { app } from "../api";
import { Request } from "express";
import { albumCollection } from "../";

app.get("/album/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const album = albumCollection[id];

  if (!album) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(album);
});
