import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { TargetBody } from "../schemas/target.schema";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

export const getDailyTarget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const target = await prisma.dailyTarget.findUnique({
      where: { userId },
    });

    res.json(target);
  } catch (err) {
    next(err);
  }
};

export const updateDailyTarget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);
  const { calories, protein, carbs, fat } = req.body as TargetBody;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const target = await prisma.dailyTarget.upsert({
      where: { userId },
      create: {
        calories,
        protein,
        carbs,
        fat,
        userId,
      },
      update: {
        calories,
        protein,
        carbs,
        fat,
      },
    });

    res.json(target);
  } catch (err) {
    next(err);
  }
};
