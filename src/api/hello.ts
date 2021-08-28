import { app } from "../api";

app.get("/hello", (_req, res) => {
  res.send("Hello");
});
