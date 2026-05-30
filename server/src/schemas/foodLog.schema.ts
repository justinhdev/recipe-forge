import { z } from "zod";
import { macroNumberSchema } from "./recipe.schema";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format");

export const foodLogBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Food name is required")
    .max(140, "Food name must be 140 characters or fewer"),
  calories: macroNumberSchema,
  protein: macroNumberSchema,
  carbs: macroNumberSchema,
  fat: macroNumberSchema,
  loggedAt: z.string().datetime("Logged at must be a valid ISO date").optional(),
});

export const foodLogDateQuerySchema = z.object({
  date: dateOnlySchema,
});

export const foodLogIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int("Food log ID must be a whole number")
    .positive("Food log ID must be positive"),
});

export type FoodLogBody = z.infer<typeof foodLogBodySchema>;
export type FoodLogDateQuery = z.infer<typeof foodLogDateQuerySchema>;
export type FoodLogIdParams = z.infer<typeof foodLogIdParamsSchema>;
