import type { FoodLog } from "@recipe-forge/contracts";
import { describe, expect, it } from "vitest";
import { sumFoodLogs } from "./nutrition";

const buildLog = (overrides: Partial<FoodLog>): FoodLog => ({
  id: 1,
  userId: 1,
  name: "Test food",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  loggedAt: "2026-06-10T12:00:00.000Z",
  createdAt: "2026-06-10T12:00:00.000Z",
  updatedAt: "2026-06-10T12:00:00.000Z",
  ...overrides,
});

describe("sumFoodLogs", () => {
  it("returns zero totals for an empty list", () => {
    expect(sumFoodLogs([])).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it("sums each macro across logs", () => {
    const logs = [
      buildLog({ id: 1, calories: 300, protein: 25, carbs: 30, fat: 10 }),
      buildLog({ id: 2, calories: 450, protein: 35, carbs: 40, fat: 15 }),
    ];

    expect(sumFoodLogs(logs)).toEqual({
      calories: 750,
      protein: 60,
      carbs: 70,
      fat: 25,
    });
  });
});
