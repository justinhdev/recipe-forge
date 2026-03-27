import MacroChart from "./MacroChart";
import { motion } from "framer-motion";
import { getIcon } from "../utils/getIcon";
import { X } from "lucide-react";
import InstructionsList from "./InstructionsList";
import type { Recipe } from "../types/recipe";

type Props = {
  recipe: Required<Recipe> | null;
  onClose: () => void;
  onDelete: (id: number) => void;
};

export default function RecipeModal({ recipe, onClose, onDelete }: Props) {
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

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 max-w-2xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-4 relative text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span>{getIcon(title)}</span>
          {title}
        </h2>

        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Ingredients:</strong> {ingredients.join(", ")}
        </p>

        <div>
          <p className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
            Instructions:
          </p>
          <InstructionsList instructions={instructions} />
        </div>

        <MacroChart protein={protein} fat={fat} carbs={carbs} />

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          {calories} kcal • {protein}g protein • {fat}g fat • {carbs}g carbs
        </p>

        <div className="flex justify-end">
          <button
            onClick={() => {
              onDelete(id);
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-400 text-sm transition duration-300"
          >
            Delete Recipe
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
