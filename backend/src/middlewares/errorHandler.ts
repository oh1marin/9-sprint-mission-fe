import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  errors?: any;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ Error:", err);

  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "서버 오류가 발생했습니다.";

  const response: any = { message };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.errors = err.errors;
  }

  res.status(status).json(response);
}
