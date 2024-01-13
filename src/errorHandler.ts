import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== "test") {
    if (!(req.headers["range"] && res.statusCode === 206)) {
      console.error("Caught:", err);
    } else {
      console.error(
        `Request ${req.headers["x-musa-proxy-request-id"] ?? ""} errored ${err.message}`,
      );
    }
  }

  if (res.headersSent) {
    console.log(
      `Request ${req.headers["x-musa-proxy-request-id"] ?? ""} isHeadersSent ${
        res.headersSent
      }`,
    );
    return next();
  }

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(500).json(err);
};
