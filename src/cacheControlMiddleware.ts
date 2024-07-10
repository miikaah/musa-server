import { NextFunction, Request, Response } from "express";

export const cacheControlMiddleware = (maxAge: number) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set({
      "Cache-Control": `public, max-age=${maxAge}`,
    });
    next();
  };
};
