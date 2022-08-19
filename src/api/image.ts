import { Request } from "express";

import { app } from "../api";
import { getImageCollection } from "../repo";

app.get("/image/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const image = getImageCollection()[id];

  if (!image) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(image);
});
