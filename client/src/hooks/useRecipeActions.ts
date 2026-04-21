import { useCallback } from "react";
import api from "../utils/api";
import type {
  GenerateOptions,
  GenerateRecipeRequest,
  GenerateRecipeResponse,
  Recipe,
  SaveRecipeRequest,
} from "../types/contracts";

export function useRecipeActions() {
  const generate = useCallback(
    async (ingredients: string[], opts: GenerateOptions) => {
      const { servings, diet, cuisine, mealType, bravery, macroPreference } =
        opts;
      const payload: GenerateRecipeRequest = {
        ingredients,
        servings,
        diet,
        cuisine,
        mealType,
        bravery,
        macroPreference,
      };
      const res = await api.post<GenerateRecipeResponse>(
        "/api/ai/generate",
        payload
      );
      return res.data;
    },
    []
  );

  const save = useCallback(async (recipe: SaveRecipeRequest) => {
    await api.post("/api/recipes", recipe);
  }, []);

  const fetchAll = useCallback(async () => {
    const res = await api.get("/api/recipes");
    return res.data as Required<Recipe>[];
  }, []);

  const remove = useCallback(async (id: number) => {
    await api.delete(`/api/recipes/${id}`);
  }, []);

  return { generate, save, fetchAll, remove };
}
