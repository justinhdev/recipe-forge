import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";
import { RecipeBody, RecipeIdParams } from "../schemas/recipe.schema";

export const getUserRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);
  const { id: recipeId } = req.params as unknown as RecipeIdParams;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe || recipe.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Recipe not found or access denied" });
    }

    await prisma.recipe.delete({ where: { id: recipeId } });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromToken(req);
  const { title, ingredients, instructions, calories, protein, fat, carbs } =
    req.body as RecipeBody;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
        calories,
        protein,
        fat,
        carbs,
        userId,
      },
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};
