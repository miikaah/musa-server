import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import crypto from "crypto"

export const app = express();

const { NODE_ENV = "" } = process.env;
const env = NODE_ENV === "production" ? ".env" : ".env.dev";

if (NODE_ENV !== "test") {
  console.log("\nUsing env file", env);
}

dotenv.config({ path: path.resolve(process.cwd(), env) });

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(compression());

app.use((req, res, next) => {
  const id = getId();
  console.log(`Request ${id} ${req.method} ${req.originalUrl}`);

  if (req.headers['range']) {
    req.addListener('error', () => {
      console.error(`Request ${id} errored ${req.originalUrl}`);
      console.error(`Request ${id}`, req.headers.range);
    });
  }

  req.addListener('end', () => {
    console.error(`Request ${id} ended ${req.originalUrl}`);
  });

  req.addListener('close', () => {
    console.error(`Request ${id} closed ${req.originalUrl}`);
  });

  res.setTimeout(60_000, () => {
    console.log(`Request ${id} timed out ${req.originalUrl}`);
  });

  next();
});

function getId(): string {
  const randomBuffer = crypto.randomBytes(16);
  const sha256Hash = crypto.createHash('sha256');
  sha256Hash.update(randomBuffer);

  const hexHash = sha256Hash.digest('hex');
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(hexHash);

  return md5Hash.digest('hex').substring(0, 9);
}