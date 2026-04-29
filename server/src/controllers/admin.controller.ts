import { NextFunction, Request, Response } from "express";
import { getGenerationStats } from "../services/generationMetrics.service";

export const getAdminStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getGenerationStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
