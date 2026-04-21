import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../errors/app.error";

const parseMock = vi.fn();

vi.mock("openai", () => ({
  OpenAI: class OpenAI {
    chat = {
      completions: {
        parse: parseMock,
      },
    };
  },
}));

describe("OpenAI service", () => {
  beforeEach(() => {
    parseMock.mockReset();
  });

  it("builds a prompt with the provided constraints", async () => {
    parseMock.mockResolvedValue({
      choices: [
        {
          message: {
            parsed: {
              title: "Test Recipe",
              ingredients: ["1 cup rice"],
              instructions: "Step 1. Cook the rice. Step 2. Serve it warm.",
              macros: {
                calories: 200,
                protein: 4,
                fat: 1,
                carbs: 44,
              },
            },
          },
        },
      ],
    });

    const { getRecipeFromIngredients } = await import("../services/openai.service");

    await getRecipeFromIngredients({
      ingredients: ["rice", "egg"],
      servings: 4,
      diet: "vegetarian",
      cuisine: "japanese",
      mealType: "dinner",
      bravery: 1.1,
      macroPreference: "protein",
    });

    expect(parseMock).toHaveBeenCalledTimes(1);

    const request = parseMock.mock.calls[0][0];
    expect(request.messages[0].content).toContain("The recipe must serve 4 people.");
    expect(request.messages[0].content).toContain("It must be a vegetarian recipe.");
    expect(request.messages[0].content).toContain("The cuisine should be japanese.");
    expect(request.messages[0].content).toContain("This is for dinner.");
    expect(request.messages[0].content).toContain(
      "Prioritize a high protein content relative to other macros."
    );
    expect(request.temperature).toBe(1.1);
  });

  it("throws a 502 app error when the model refuses the response", async () => {
    parseMock.mockResolvedValue({
      choices: [
        {
          message: {
            refusal: "I can't help with that.",
          },
        },
      ],
    });

    const { getRecipeFromIngredients } = await import("../services/openai.service");

    await expect(
      getRecipeFromIngredients({
        ingredients: ["rice"],
      })
    ).rejects.toMatchObject({
      message: "OpenAI refused to generate a recipe",
      statusCode: 502,
    } satisfies Partial<AppError>);
  });
});
