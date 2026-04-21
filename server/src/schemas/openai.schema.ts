import { z } from "zod";
import {
  ingredientSchema,
  macroNumberSchema,
  recipeBodySchema,
} from "./recipe.schema";

const noneableStringSchema = z
  .string()
  .trim()
  .min(1, "Option values cannot be empty")
  .max(50, "Option values must be 50 characters or fewer");

export const generateRecipeBodySchema = z.object({
  ingredients: z
    .array(ingredientSchema)
    .min(1, "Select at least one ingredient")
    .max(20, "Select 20 ingredients or fewer"),
  servings: z
    .number()
    .int("Servings must be a whole number")
    .min(1, "Servings must be at least 1")
    .max(20, "Servings must be 20 or fewer")
    .optional(),
  diet: noneableStringSchema.optional(),
  cuisine: noneableStringSchema.optional(),
  mealType: noneableStringSchema.optional(),
  bravery: z
    .number()
    .min(0, "Bravery must be at least 0")
    .max(1.5, "Bravery must be 1.5 or lower")
    .optional(),
  macroPreference: noneableStringSchema.optional(),
});

export const openAIRecipeSchema = z.object({
  title: recipeBodySchema.shape.title,
  ingredients: recipeBodySchema.shape.ingredients,
  instructions: recipeBodySchema.shape.instructions,
  macros: z.object({
    calories: macroNumberSchema,
    protein: macroNumberSchema,
    fat: macroNumberSchema,
    carbs: macroNumberSchema,
  }),
});

export type GenerateRecipeBody = z.infer<typeof generateRecipeBodySchema>;
export type OpenAIRecipe = z.infer<typeof openAIRecipeSchema>;
