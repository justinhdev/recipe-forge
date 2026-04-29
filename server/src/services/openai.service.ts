import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { AppError } from "../errors/app.error";
import {
  GenerateRecipeBody,
  OpenAIRecipe,
  openAIRecipeSchema,
} from "../schemas/openai.schema";

export const RECIPE_PROMPT_VERSION = "recipe-v1";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type OpenAIRecipeGeneration = {
  recipe: OpenAIRecipe;
  model: string;
  promptVersion: string;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
};

export const generateRecipeWithMetadata = async (
  options: GenerateRecipeBody
): Promise<OpenAIRecipeGeneration> => {
  const {
    ingredients,
    servings = 2,
    diet = "none",
    cuisine = "none",
    mealType = "none",
    bravery = 0.7,
    macroPreference = "none",
  } = options;

  const constraints: string[] = [];
  if (servings > 0) {
    constraints.push(`The recipe must serve ${servings} people.`);
  }
  if (diet !== "none") {
    constraints.push(`It must be a ${diet} recipe.`);
  }
  if (cuisine !== "none") {
    constraints.push(`The cuisine should be ${cuisine}.`);
  }
  if (mealType !== "none") {
    constraints.push(`This is for ${mealType}.`);
  }
  if (macroPreference !== "none") {
    constraints.push(
      `Prioritize a high ${macroPreference} content relative to other macros.`
    );
  }

  const prompt = `
You are a professional chef and nutritionist. Based on the provided ingredients and constraints, create a healthy, realistic recipe in **strict JSON format** — no extra text.

FORMAT:
{
  "title": "Recipe Name",
  "ingredients": [
    "exact amounts and units for each ingredient (e.g., 1 cup milk, 2 tbsp olive oil)"
  ],
  "instructions": "Step 1. Full sentence or sentences. Step 2. Full sentence or sentences. Step 3. ...",
  "macros": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number
  }
}

RECIPE REQUIREMENTS:
${
  constraints.length > 0
    ? constraints.map((c) => `- ${c}`).join("\n")
    : "- Follow user-provided ingredients."
}
- Write **6 to 8 detailed steps** with heat levels, cooking times, and prep techniques.
- Each step must start with: **Step X.** followed by a full, clear sentence or sentences.
- Use only the provided ingredients plus pantry staples (salt, pepper, oil, water).
- Instructions must be inside one string with no line breaks or Markdown.
- Output must be **valid JSON only** — no commentary or formatting.

INGREDIENTS: ${ingredients.join(", ")}
`;

  const temperature = bravery ? Math.min(Math.max(bravery, 0), 1.5) : 0.7;

  const model = process.env.OPENAI_MODEL || "gpt-4o-2024-08-06";

  const response = await openai.chat.completions.parse({
    model,
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(openAIRecipeSchema, "recipe"),
    temperature,
    max_tokens: 1000,
  });

  const message = response.choices[0]?.message;
  const parsedRecipe = message?.parsed;
  const usage = response.usage;

  if (!parsedRecipe) {
    if (message?.refusal) {
      throw new AppError("OpenAI refused to generate a recipe", 502, {
        refusal: message.refusal,
      });
    }

    throw new AppError("OpenAI returned an invalid recipe response", 502);
  }

  return {
    recipe: openAIRecipeSchema.parse(parsedRecipe),
    model,
    promptVersion: RECIPE_PROMPT_VERSION,
    tokenUsage: usage
      ? {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        }
      : undefined,
  };
};

export const getRecipeFromIngredients = async (
  options: GenerateRecipeBody
): Promise<OpenAIRecipe> => {
  const { recipe } = await generateRecipeWithMetadata(options);
  return recipe;
};
