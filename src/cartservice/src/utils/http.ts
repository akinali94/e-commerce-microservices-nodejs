import type { Request, Response, NextFunction } from "express";

export type HttpError = { status: number; code: string; message: string };

export function toHttpError(err: unknown): HttpError {
  if (isHttpError(err)) return err;
  // Map storage unavailable, etc. If you want to detect specific errors, add cases here.
  return { status: 500, code: "internal_error", message: "Something went wrong" };
}

export function isHttpError(x: unknown): x is HttpError {
  return !!x && typeof x === "object" && "status" in x && "code" in x && "message" in x;
}

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const e = toHttpError(err);
  res.status(e.status).json({ error: e.code, message: e.message });
}
