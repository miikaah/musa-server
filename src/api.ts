import express from "express";
import cors from "cors";
import compression from "compression";

export const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(compression());
