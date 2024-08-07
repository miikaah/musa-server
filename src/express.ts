import compression from "compression";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { logger } from "./logger";

const { ROOT_DIR = "", NODE_ENV = "" } = process.env;
const env = ROOT_DIR
  ? path.resolve(ROOT_DIR, ".env")
  : path.resolve(process.cwd(), ".env.dev");

if (NODE_ENV !== "test") {
  logger.log("\nUsing env file", env);
}

dotenv.config({ path: env });

export const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(compression());

app.use((req, res, next) => {
  const id = req.headers["x-musa-proxy-request-id"] ?? getId();
  logger.log(`Request ${id} ${req.method} ${req.originalUrl}`);

  // It's useful to see the range being requested for partial content
  if (req.headers["range"]) {
    logger.log(`Request ${id}`, req.headers.range);
  }

  // Close should always be called
  req.addListener("close", () => {
    logger.log(`Request ${id} closed ${res.statusCode} ${req.originalUrl}`);
  });

  // res.addListener("close", () => {
  //   logger.log(`Response ${id} closed ${res.statusCode} ${req.originalUrl}`);
  // });

  // Express default timeout is 5 minutes
  res.setTimeout(10_000, () => {
    // logger.log(`Request ${id} timed out ${req.originalUrl}`);
    // NOTE: Nuking the request here closes everything correctly
    req.destroy();
    res.status(408).end();
  });

  next();
});

function getId(): string {
  const randomBuffer = crypto.randomBytes(16);
  const sha256Hash = crypto.createHash("sha256");
  sha256Hash.update(randomBuffer);

  const hexHash = sha256Hash.digest("hex");
  const md5Hash = crypto.createHash("md5");
  md5Hash.update(hexHash);

  return md5Hash.digest("hex").substring(0, 9);
}
