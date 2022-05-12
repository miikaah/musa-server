import express from "express";
import cors from "cors";
import compression from "compression";

export const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(compression());

export * from "./api/find";
export * from "./api/file";
export * from "./api/artist";
export * from "./api/album";
export * from "./api/audio";
export * from "./api/image";
export * from "./api/settings";
export * from "./api/theme";
export * from "./api/static";
