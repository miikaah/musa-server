import express from "express";

export const app = express();

app.use(express.json());

// Routes
export * from "./api/hello";
export * from "./api/find";
export * from "./api/file";
