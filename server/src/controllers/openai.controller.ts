import { NextFunction, Request, Response } from "express";
import { GenerationStatus, Prisma } from "@prisma/client";
import { ZodError } from "zod";
import {
  generateRecipeWithMetadata,
  RECIPE_PROMPT_VERSION,
} from "../services/openai.service";
import { GenerateRecipeBody } from "../schemas/openai.schema";
import { recipeBodySchema } from "../schemas/recipe.schema";
import {
  createGenerationInputHash,
  recordGenerationMetric,
} from "../services/generationMetrics.service";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";
import { AppError } from "../errors/app.error";

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
  const generationOptions = {
    ingredients,
    servings,
    diet,
    cuisine,
    mealType,
    bravery,
    macroPreference,
  };
  const startedAt = Date.now();
  const inputHash = createGenerationInputHash(generationOptions);
  const requestId = res.locals.requestId as string | undefined;
  const userId = getUserIdFromToken(req);
  let model = process.env.OPENAI_MODEL || "gpt-4o-2024-08-06";
  let promptVersion = RECIPE_PROMPT_VERSION;
  let tokenUsage:
    | {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
      }
    | undefined;

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
    const generation = await generateRecipeWithMetadata(generationOptions);
    const recipe = generation.recipe;
    model = generation.model;
    promptVersion = generation.promptVersion;
    tokenUsage = generation.tokenUsage;

    const responseBody = recipeBodySchema.parse({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: sanitizeInstructions(recipe.instructions),
      calories: recipe.macros.calories,
      protein: recipe.macros.protein,
      fat: recipe.macros.fat,
      carbs: recipe.macros.carbs,
    });

    await recordGenerationMetric({
      requestId,
      inputHash,
      promptVersion,
      model,
      status: GenerationStatus.SUCCESS,
      latencyMs: Date.now() - startedAt,
      userId,
      tokenUsage,
    });

    res.json(responseBody);
  } catch (err) {
    const validationFailures =
      err instanceof ZodError
        ? err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }))
        : undefined;
    const failureReason =
      err instanceof ZodError
        ? "validation_failed"
        : err instanceof AppError
          ? err.message
          : "generation_failed";

    await recordGenerationMetric({
      requestId,
      inputHash,
      promptVersion,
      model,
      status: GenerationStatus.FAILURE,
      latencyMs: Date.now() - startedAt,
      userId,
      tokenUsage,
      failureReason,
      validationFailures: validationFailures as
        | Prisma.InputJsonValue
        | undefined,
    });

    next(err);
  }
};
