import { app } from "../api";
import { Request } from "express";
import { imageCollection } from "../";

app.get("/image/:id", (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const image = imageCollection[id];

  if (!image) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  res.status(200).json(image);
});
