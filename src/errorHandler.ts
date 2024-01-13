import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.headers["x-musa-proxy-request-id"] ?? "";

  if (process.env.NODE_ENV !== "test") {
    console.error(`Request ${id} errored ${err.message}`);
  }

  if (res.headersSent) {
    console.log(`Request ${id} isHeadersSent ${res.headersSent}`);
    return next();
  }

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(500).json(err);
};
