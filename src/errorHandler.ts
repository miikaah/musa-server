import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  if (res.headersSent) {
    return next();
  }

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(500).json(err);
};
