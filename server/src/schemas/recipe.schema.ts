import { z } from "zod";

export const ingredientSchema = z
  .string()
  .trim()
  .min(1, "Ingredients cannot be empty")
  .max(120, "Ingredients must be 120 characters or fewer");

export const macroNumberSchema = z
  .number()
  .finite("Macro values must be valid numbers")
  .min(0, "Macro values cannot be negative")
  .max(10000, "Macro values look unrealistically high");

export const recipeBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(140, "Title must be 140 characters or fewer"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required")
    .max(50, "Ingredients must contain 50 items or fewer"),
  instructions: z
    .string()
    .trim()
    .min(1, "Instructions are required")
    .max(8000, "Instructions must be 8000 characters or fewer"),
  calories: macroNumberSchema,
  protein: macroNumberSchema,
  fat: macroNumberSchema,
  carbs: macroNumberSchema,
});

export const recipeIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int("Recipe ID must be a whole number")
    .positive("Recipe ID must be positive"),
});

export type RecipeBody = z.infer<typeof recipeBodySchema>;
export type RecipeIdParams = z.infer<typeof recipeIdParamsSchema>;
