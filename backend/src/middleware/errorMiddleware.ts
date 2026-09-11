import {
  Request,
  Response,
  NextFunction,
} from "express";

interface AppError extends Error {
  statusCode?: number;
}

const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(error);

  const statusCode =
    error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      error.message ||
      "Internal server error",
  });
};

export default errorMiddleware;