import express from "express";

import { app } from "../express";

const { FRONTEND_BUILD_DIR = "", NODE_ENV = "" } = process.env;

if (NODE_ENV !== "test") {
  app.use("/", express.static(FRONTEND_BUILD_DIR));

  app.use("/search", express.static(FRONTEND_BUILD_DIR));
  app.use("/settings", express.static(FRONTEND_BUILD_DIR));
}
