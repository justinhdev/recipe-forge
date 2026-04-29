import { motion } from "framer-motion";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import MacroChart from "./MacroChart";
import InstructionsList from "./InstructionsList";
import { getIcon } from "../utils/getIcon";
import type { Recipe } from "../types/recipe";

type Props = {
  recipe: Recipe;
  onSave?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  disableSave?: boolean;
  saveLabel?: string;
};

export default function RecipeDetails({
  recipe,
  onSave,
  onDelete,
  disableSave,
  saveLabel = "Save Recipe",
}: Props) {
  const [showMacros, setShowMacros] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <motion.div
      key={recipe.title}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-white p-5 text-sm dark:bg-gray-800 sm:p-6 sm:text-base"
    >
      <h3 className="mb-2 flex items-start justify-center gap-2 text-center text-lg font-semibold leading-snug sm:text-xl">
        <span className="shrink-0">{getIcon(recipe.title)}</span>
        <span className="min-w-0 break-words">{recipe.title}</span>
      </h3>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Ingredients
      </h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.ingredients.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="cursor-default rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {item}
          </span>
        ))}
      </div>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-4 mb-2">
        Instructions
      </h4>
      <InstructionsList instructions={recipe.instructions} />

      <div className="mt-4">
        <p className="mb-1 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {recipe.calories} kcal • {recipe.protein}g protein • {recipe.fat}g fat
          • {recipe.carbs}g carbs
        </p>

        <div className="text-center mt-2">
          <button
            onClick={() => setShowMacros((p) => !p)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-sm text-blue-500 transition hover:bg-blue-500 hover:text-white dark:text-blue-400"
          >
            <BarChart3 size={18} />
            <span>{showMacros ? "Hide Chart" : "Show Chart"}</span>
          </button>
        </div>

        {showMacros && (
          <div className="mt-4">
            <MacroChart
              protein={recipe.protein}
              fat={recipe.fat}
              carbs={recipe.carbs}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 min-[380px]:flex-row min-[380px]:justify-end">
        {onDelete && (
          <button
            onClick={() => onDelete()}
            className="rounded bg-red-500 px-4 py-2 text-sm text-white transition duration-300 hover:bg-red-600 dark:hover:bg-red-400"
          >
            Delete
          </button>
        )}
        {onSave && (
          <button
            onClick={async () => {
              if (saving || disableSave) return;
              setSaving(true);
              try {
                await onSave();
              } finally {
                setSaving(false);
              }
            }}
            disabled={disableSave || saving}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              disableSave
                ? "cursor-default border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                : saving
                  ? "cursor-wait bg-blue-400 text-white dark:bg-blue-600"
                  : "cursor-pointer bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            {disableSave && <CheckCircle2 size={14} />}
            {disableSave ? "Saved" : saving ? "Saving…" : saveLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
