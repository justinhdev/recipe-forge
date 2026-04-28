/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import {
  formatIngredientName,
  INGREDIENTS,
  normalizeIngredientName,
} from "./ingredientList";

describe("ingredientList", () => {
  it("normalizes ingredient names for matching and storage", () => {
    expect(normalizeIngredientName("  Black   Garlic  ")).toBe("black garlic");
  });

  it("formats ingredient names for display", () => {
    expect(formatIngredientName("extra virgin olive oil")).toBe(
      "Extra Virgin Olive Oil"
    );
    expect(formatIngredientName("za'atar")).toBe("Za'atar");
  });

  it("exports normalized, sorted ingredients for search", () => {
    expect(INGREDIENTS).toContain("chinese five spice");
    expect(INGREDIENTS).not.toContain("Chinese five spice");
  });
});
