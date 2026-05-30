import { z } from "zod";
import { macroNumberSchema } from "./recipe.schema";

export const targetBodySchema = z.object({
  calories: macroNumberSchema,
  protein: macroNumberSchema,
  carbs: macroNumberSchema,
  fat: macroNumberSchema,
});

export type TargetBody = z.infer<typeof targetBodySchema>;
