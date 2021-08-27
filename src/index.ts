import express from "express";

const PORT = process.env.PORT || 3003;
const app = express();

app.use(express.json());

app.use("/", (_req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => console.log(`Serving http://localhost:${PORT}`));
