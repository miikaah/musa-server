import express from "express";

const PORT = process.env.PORT || 3003;
const { NODE_ENV } = process.env;
export const app = express();

app.use(express.json());

app.use("/hello", (_req, res) => {
  res.send("Hello");
});

if (NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Serving http://localhost:${PORT}`));
}
