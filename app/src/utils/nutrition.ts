import type { FoodLog } from "@recipe-forge/contracts";

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function sumFoodLogs(logs: FoodLog[]): NutritionTotals {
  return logs.reduce<NutritionTotals>(
    (totals, log) => ({
      calories: totals.calories + log.calories,
      protein: totals.protein + log.protein,
      carbs: totals.carbs + log.carbs,
      fat: totals.fat + log.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
