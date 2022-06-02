import { Request, Response, NextFunction } from "express";

const { NODE_ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (NODE_ENV !== "test") {
    console.error(err);
  }

  if (NODE_ENV === "production" || NODE_ENV === "test") {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(500).json(err);
};
