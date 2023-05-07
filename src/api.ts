import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

export const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(compression());
