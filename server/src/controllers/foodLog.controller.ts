import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";
import {
  FoodLogBody,
  FoodLogDateQuery,
  FoodLogIdParams,
} from "../schemas/foodLog.schema";

function getUtcDateRange(date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

export const createFoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);
  const { name, calories, protein, carbs, fat, loggedAt } =
    req.body as FoodLogBody;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const foodLog = await prisma.foodLog.create({
      data: {
        name,
        calories,
        protein,
        carbs,
        fat,
        ...(loggedAt ? { loggedAt: new Date(loggedAt) } : {}),
        userId,
      },
    });

    res.status(201).json(foodLog);
  } catch (err) {
    next(err);
  }
};

export const getFoodLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);
  const { date } = req.query as unknown as FoodLogDateQuery;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { start, end } = getUtcDateRange(date);
    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { loggedAt: "asc" },
    });

    res.json(foodLogs);
  } catch (err) {
    next(err);
  }
};

export const deleteFoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);
  const { id: foodLogId } = req.params as unknown as FoodLogIdParams;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const foodLog = await prisma.foodLog.findUnique({
      where: { id: foodLogId },
    });

    if (!foodLog || foodLog.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Food log not found or access denied" });
    }

    await prisma.foodLog.delete({ where: { id: foodLogId } });
    res.json({ message: "Food log deleted successfully" });
  } catch (err) {
    next(err);
  }
};
