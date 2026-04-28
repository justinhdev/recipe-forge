/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRecipeActions } from "./useRecipeActions";

const { deleteMock, getMock, postMock } = vi.hoisted(() => ({
  deleteMock: vi.fn(),
  getMock: vi.fn(),
  postMock: vi.fn(),
}));

vi.mock("../utils/api", () => ({
  default: {
    delete: deleteMock,
    get: getMock,
    post: postMock,
  },
}));

const recipe = {
  title: "Test Recipe",
  ingredients: ["1 cup rice"],
  instructions: "Step 1. Cook rice.",
  calories: 200,
  protein: 4,
  fat: 1,
  carbs: 44,
};

describe("useRecipeActions", () => {
  beforeEach(() => {
    deleteMock.mockReset();
    getMock.mockReset();
    postMock.mockReset();
  });

  it("generates recipes with the selected ingredients and options", async () => {
    postMock.mockResolvedValue({ data: recipe });
    const { result } = renderHook(() => useRecipeActions());

    await expect(
      result.current.generate(["rice"], {
        servings: 2,
        diet: "none",
        cuisine: "Japanese",
        mealType: "Dinner",
        bravery: 0.7,
        macroPreference: "Protein",
      })
    ).resolves.toEqual(recipe);

    expect(postMock).toHaveBeenCalledWith("/api/ai/generate", {
      ingredients: ["rice"],
      servings: 2,
      diet: "none",
      cuisine: "Japanese",
      mealType: "Dinner",
      bravery: 0.7,
      macroPreference: "Protein",
    });
  });

  it("wraps saved recipe CRUD endpoints", async () => {
    getMock.mockResolvedValue({ data: [{ ...recipe, id: 1 }] });
    postMock.mockResolvedValue({ data: recipe });
    deleteMock.mockResolvedValue({ data: { message: "ok" } });
    const { result } = renderHook(() => useRecipeActions());

    await result.current.save(recipe);
    await expect(result.current.fetchAll()).resolves.toEqual([
      { ...recipe, id: 1 },
    ]);
    await result.current.remove(1);

    expect(postMock).toHaveBeenCalledWith("/api/recipes", recipe);
    expect(getMock).toHaveBeenCalledWith("/api/recipes");
    expect(deleteMock).toHaveBeenCalledWith("/api/recipes/1");
  });
});
