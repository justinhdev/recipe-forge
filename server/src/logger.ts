import pino from "pino";

export const logger = pino({
  enabled: process.env.NODE_ENV !== "test",
  level: process.env.LOG_LEVEL || "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});
