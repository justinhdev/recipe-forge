import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import RecipeShimmer from "../components/RecipeShimmer";
import { AnimatePresence, motion } from "framer-motion";
import { useRecipeActions } from "../hooks/useRecipeActions";
import { toMessage } from "../utils/error";
import type { Recipe } from "../types/recipe";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-12 text-center dark:border-gray-700 dark:bg-gray-800 sm:px-8 sm:py-16">
      <span className="text-5xl mb-4">🍽️</span>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        No recipes yet
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
        Generate your first recipe and save it here to build your collection.
      </p>
      <Link
        to="/generate"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:hover:bg-blue-500"
      >
        Generate a Recipe →
      </Link>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(100%,_300px),_1fr))] gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <RecipeShimmer key={i} />
      ))}
    </div>
  );
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Required<Recipe>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Required<Recipe> | null>(null);
  const [search, setSearch] = useState("");

  const { fetchAll, remove } = useRecipeActions();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAll();
        setRecipes(data);
      } catch (e: unknown) {
        setError(toMessage(e, "Failed to fetch recipes"));
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAll]);

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
    } catch (e: unknown) {
      setError(toMessage(e, "Failed to delete recipe"));
    }
  };

  const filtered = recipes.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  });

  return (
    <PageWrapper>
      {/* Header row */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2 min-[380px]:flex-row min-[380px]:items-center min-[380px]:gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Saved Recipes
          </h2>
          {!loading && recipes.length > 0 && (
            <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Search */}
        {!loading && recipes.length > 0 && (
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search recipes or ingredients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-8 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">{error}</p>
      ) : recipes.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recipes match "<strong>{search}</strong>".
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(100%,_300px),_1fr))] items-stretch gap-6">
          {filtered.map((recipe) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <RecipeCard
                {...recipe}
                onSelect={(r) => setSelected(r as Required<Recipe>)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <RecipeModal
            recipe={selected}
            onClose={() => setSelected(null)}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
