import { app } from "../api";
import { Request } from "express";
import { artistCollection } from "../";

app.get("/artist/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const artist = artistCollection[id];

  if (!artist) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(artist);
});
