import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId =
    req.header("x-request-id") || req.header("x-correlation-id") || randomUUID();
  const startedAt = Date.now();

  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const user = (req as Request & { user?: { userId?: number } }).user;

    logger.info({
      event: "http_request",
      requestId,
      method: req.method,
      route: req.route?.path,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: user?.userId,
      userAgent: req.header("user-agent"),
    });
  });

  next();
};
