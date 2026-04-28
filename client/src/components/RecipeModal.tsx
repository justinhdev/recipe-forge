import { useState } from "react";
import MacroChart from "./MacroChart";
import { motion, AnimatePresence } from "framer-motion";
import { getIcon } from "../utils/getIcon";
import { X, Trash2, Copy, Check } from "lucide-react";
import InstructionsList from "./InstructionsList";
import type { Recipe } from "../types/recipe";

type Props = {
  recipe: Required<Recipe> | null;
  onClose: () => void;
  onDelete: (id: number) => void;
};

function buildShareText(recipe: Required<Recipe>): string {
  return [
    `🍴 ${recipe.title}`,
    "",
    `Ingredients: ${recipe.ingredients.join(", ")}`,
    "",
    `Instructions:\n${recipe.instructions}`,
    "",
    `Macros: ${recipe.calories} kcal · ${recipe.protein}g protein · ${recipe.fat}g fat · ${recipe.carbs}g carbs`,
  ].join("\n");
}

export default function RecipeModal({ recipe, onClose, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMacros, setShowMacros] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!recipe) return null;

  const {
    id,
    title,
    ingredients,
    instructions,
    calories,
    protein,
    fat,
    carbs,
  } = recipe;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(recipe));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  };

  const handleDelete = () => {
    onDelete(id);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 py-3 sm:items-center sm:px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-green-500 shrink-0" />

        {/* Scrollable body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            <X size={14} />
          </button>

          {/* Title */}
          <h2 className="flex items-start gap-2 pr-8 text-lg font-bold leading-snug sm:text-xl">
            <span className="shrink-0">{getIcon(title)}</span>
            <span className="min-w-0 break-words">{title}</span>
          </h2>

          {/* Ingredient pills */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              Ingredients
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((item, idx) => (
                <span
                  key={`${item}-${idx}`}
                  className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-700 dark:text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              Instructions
            </p>
            <InstructionsList instructions={instructions} />
          </div>

          {/* Macro row */}
          <div className="flex flex-wrap gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
            {[
              {
                label: `${protein}g protein`,
                bg: "bg-blue-50 dark:bg-blue-950",
                text: "text-blue-700 dark:text-blue-300",
              },
              {
                label: `${fat}g fat`,
                bg: "bg-yellow-50 dark:bg-yellow-950",
                text: "text-yellow-700 dark:text-yellow-300",
              },
              {
                label: `${carbs}g carbs`,
                bg: "bg-green-50 dark:bg-green-950",
                text: "text-green-700 dark:text-green-300",
              },
              {
                label: `${calories} kcal`,
                bg: "bg-purple-50 dark:bg-purple-950",
                text: "text-purple-700 dark:text-purple-300",
              },
            ].map(({ label, bg, text }) => (
              <span
                key={label}
                className={`${bg} ${text} rounded-full px-3 py-1 text-xs font-semibold`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Macro chart toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowMacros((p) => !p)}
              className="text-xs text-blue-500 dark:text-blue-400 hover:underline"
            >
              {showMacros ? "Hide chart" : "Show macro chart"}
            </button>
          </div>
          {showMacros && (
            <MacroChart protein={protein} fat={fat} carbs={carbs} />
          )}
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-800 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between sm:px-6">
          <div className="grid grid-cols-2 gap-2 min-[380px]:flex min-[380px]:items-center">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {copied ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <Copy size={12} />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title,
                      text: buildShareText(recipe),
                    });
                  } else {
                    handleCopy();
                  }
                } catch {
                  // User canceled or sharing failed.
                }
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              🔗 Share
            </button>
          </div>

          {/* Delete — ghost style, opens confirm */}
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(false);
            }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Delete this recipe?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                This action can't be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
