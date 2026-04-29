import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app.error";
import { logger } from "../logger";

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;
  const requestId = res.locals.requestId as string | undefined;

  if (error instanceof ZodError) {
    logger.warn({
      event: "request_validation_failed",
      requestId,
      statusCode: 400,
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });

    return res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    logger.warn({
      event: "app_error",
      requestId,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });

    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  logger.error({
    event: "unhandled_error",
    requestId,
    error,
  });

  return res.status(500).json({ message: "Internal server error" });
};
