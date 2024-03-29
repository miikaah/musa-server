import { Request } from "express";

import { app } from "../express";
import { getImageCollection } from "../repo";

app.get("/images/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const image = getImageCollection()[id];

  if (!image) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(image);
});
