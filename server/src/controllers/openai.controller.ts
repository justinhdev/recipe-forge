import { NextFunction, Request, Response } from "express";
import { getRecipeFromIngredients } from "../services/openai.service";
import { GenerateRecipeBody } from "../schemas/openai.schema";
import { recipeBodySchema } from "../schemas/recipe.schema";

export const generateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    ingredients,
    servings,
    diet,
    cuisine,
    mealType,
    bravery,
    macroPreference,
  } = req.body as GenerateRecipeBody;

  function sanitizeInstructions(instructions: string): string {
    return instructions
      .replace(/\n+/g, " ")
      .replace(/\bStep\b(?!\s*\d+\.)/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/Step\s+(\d)([^\d])/g, "Step $1.$2")
      .replace(/\.?\s*Step\s+(\d)\./g, " Step $1.")
      .replace(/\.\s*\./g, ".")
      .trim();
  }

  try {
    const recipe = await getRecipeFromIngredients({
      ingredients,
      servings,
      diet,
      cuisine,
      mealType,
      bravery,
      macroPreference,
    });

    const responseBody = recipeBodySchema.parse({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: sanitizeInstructions(recipe.instructions),
      calories: recipe.macros.calories,
      protein: recipe.macros.protein,
      fat: recipe.macros.fat,
      carbs: recipe.macros.carbs,
    });

    res.json(responseBody);
  } catch (err) {
    next(err);
  }
};
