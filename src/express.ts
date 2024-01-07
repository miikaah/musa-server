import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

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

// Middleware to log the number of connections
app.use((req, res, next) => {
  // Log the connection information
  console.log(`Number of connections: ${app.locals.connections || 0}`);

  // Increment the connection count
  app.locals.connections = (app.locals.connections || 0) + 1;

  // Handle the request
  next();

  // Decrement the connection count after the response is sent
  app.locals.connections -= 1;
});
