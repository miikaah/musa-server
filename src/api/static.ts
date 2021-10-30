import express from "express";
import { app } from "../api";

const { FRONTEND_BUILD_DIR = "" } = process.env;

app.use("/", express.static(FRONTEND_BUILD_DIR));

app.use("/search", express.static(FRONTEND_BUILD_DIR));
app.use("/settings", express.static(FRONTEND_BUILD_DIR));
