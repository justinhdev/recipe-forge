import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import IngredientInput from "../components/IngredientInput";
import RecipeDetails from "../components/RecipeDetails";
import AdvancedOptions from "../components/AdvancedOptions";
import RecipeShimmer from "../components/RecipeShimmer";
import { Wand2, CheckCircle2 } from "lucide-react";
import { INGREDIENTS } from "../utils/ingredientList";
import { useRecipeActions } from "../hooks/useRecipeActions";
import { toMessage } from "../utils/error";
import type { Recipe, GenerateOptions } from "../types/recipe";

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          <CheckCircle2 size={16} className="text-green-400 shrink-0" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GenerateRecipe() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [options, setOptions] = useState<GenerateOptions>({
    servings: 2,
    diet: "none",
    cuisine: "none",
    mealType: "none",
    bravery: 0.7,
    macroPreference: "none",
  });
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(false);
  const savingRef = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { generate, save } = useRecipeActions();

  // Clean up toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = () => {
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 3000);
  };

  const handleSurpriseMe = () => {
    const shuffled = [...INGREDIENTS].sort(() => 0.5 - Math.random());
    setSelectedIngredients(shuffled.slice(0, 4));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);
    setSaved(false);
    try {
      const r = await generate(selectedIngredients, options);
      setRecipe(r);
    } catch (e: unknown) {
      setError(toMessage(e, "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe || savingRef.current) return;
    savingRef.current = true;
    try {
      await save(recipe);
      setSaved(true);
      showToast();
    } catch (e: unknown) {
      setError(toMessage(e, "Failed to save recipe"));
    } finally {
      savingRef.current = false;
    }
  };

  const twoCol = recipe || loading;
  const canGenerate = selectedIngredients.length > 0 && !loading;

  return (
    <PageWrapper>
      <Toast message="Recipe saved to My Recipes!" visible={toast} />

      <div
        className={`grid gap-8 items-start ${
          twoCol ? "md:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"
        }`}
      >
        {/* Left panel — inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-2xl font-bold">Generate a Recipe</h2>

          <div className="flex flex-col h-full">
            <div className="flex-grow space-y-4">
              <IngredientInput
                value={selectedIngredients}
                onChange={setSelectedIngredients}
              />
              <AdvancedOptions value={options} onChange={setOptions} />
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 mt-4 text-sm">
                {error}
              </p>
            )}

            {/* Helper text when no ingredients */}
            {selectedIngredients.length === 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <span className="text-amber-400">💡</span>
                Add at least one ingredient to generate a recipe
              </p>
            )}

            <div className="mt-4 flex items-center gap-3 pt-1">
              {/* Primary action */}
              <button
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ${
                  canGenerate
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm shadow-blue-200 dark:shadow-none"
                    : "cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                } ${loading ? "cursor-wait" : ""}`}
                onClick={handleGenerate}
                disabled={!canGenerate}
              >
                {loading ? "Generating…" : "Generate Recipe"}
              </button>

              {/* Secondary action — visually smaller */}
              <span className="text-xs text-gray-300 dark:text-gray-600">
                or
              </span>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Wand2 size={13} />
                Surprise Me
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right panel — result */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RecipeShimmer />
            </motion.div>
          ) : recipe ? (
            <RecipeDetails
              recipe={recipe}
              onSave={handleSave}
              disableSave={saved}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
