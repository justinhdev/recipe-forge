import { getIcon } from "../utils/getIcon";

type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt: string;
};

type RecipeProps = Recipe & {
  onSelect: (recipe: Recipe) => void;
};

// Derive a consistent accent color from the recipe title for the top border
const ACCENT_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-green-500 to-emerald-400",
  "from-orange-400 to-amber-300",
  "from-purple-500 to-violet-400",
  "from-rose-500 to-pink-400",
  "from-teal-500 to-green-400",
];

function getAccent(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}

const INGREDIENT_LIMIT = 5;

export default function RecipeCard({
  id,
  title,
  ingredients,
  instructions,
  calories,
  protein,
  fat,
  carbs,
  createdAt,
  onSelect,
}: RecipeProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const visibleIngredients = ingredients.slice(0, INGREDIENT_LIMIT);
  const extraCount = ingredients.length - INGREDIENT_LIMIT;
  const accent = getAccent(title);

  return (
    <button
      type="button"
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer overflow-hidden flex flex-col h-full w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      onClick={() =>
        onSelect({
          id,
          title,
          ingredients,
          instructions,
          calories,
          protein,
          fat,
          carbs,
          createdAt,
        })
      }
    >
      {/* Colored accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <span className="shrink-0 text-xl leading-none">
              {getIcon(title)}
            </span>
            <h3 className="min-w-0 text-sm font-bold leading-snug text-gray-900 break-words dark:text-white sm:text-base">
              {title}
            </h3>
          </div>
          <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Ingredient pills */}
        <div className="flex flex-wrap gap-1.5">
          {visibleIngredients.map((ing) => (
            <span
              key={ing}
              className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-300"
            >
              {ing}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs text-gray-400 dark:text-gray-500">
              +{extraCount} more
            </span>
          )}
        </div>

        {/* Macro pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            {protein}g protein
          </span>
          <span className="rounded-full bg-yellow-50 dark:bg-yellow-950 px-2.5 py-0.5 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
            {fat}g fat
          </span>
          <span className="rounded-full bg-green-50 dark:bg-green-950 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300">
            {carbs}g carbs
          </span>
          <span className="rounded-full bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
            {calories} kcal
          </span>
        </div>

        {/* CTA */}
        <span className="text-blue-600 dark:text-blue-400 group-hover:underline text-xs font-medium w-fit">
          View Recipe →
        </span>
      </div>
    </button>
  );
}
