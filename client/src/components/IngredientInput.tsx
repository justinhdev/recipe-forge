import { useState, useMemo, useEffect, useRef, useId } from "react";
import Fuse from "fuse.js";
import { Plus, X } from "lucide-react";
import {
  formatIngredientName,
  INGREDIENTS,
  normalizeIngredientName,
} from "../utils/ingredientList";

type Props = {
  value: string[];
  onChange: (selected: string[]) => void;
};

export default function IngredientInput({ value, onChange }: Props) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLButtonElement[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(INGREDIENTS, {
        threshold: 0.3,
      }),
    []
  );

  const cleanQuery = normalizeIngredientName(query);
  const suggestions = query
    ? fuse
        .search(query)
        .map((r) => r.item)
        .filter((i) => !value.includes(i))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    const el = itemRefs.current[highlightedIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [highlightedIndex]);

  const addIngredient = (ingredientValue: string) => {
    const cleanValue = normalizeIngredientName(ingredientValue);
    if (!cleanValue || value.includes(cleanValue)) return;

    const updated = [...value, cleanValue];
    onChange(updated);
    setQuery("");
    setDropdownOpen(false);
  };

  const removeIngredient = (ingredient: string) => {
    const updated = value.filter((i) => i !== ingredient);
    onChange(updated);
  };

  const isRecognized = (ingredient: string) =>
    INGREDIENTS.includes(normalizeIngredientName(ingredient));

  const hasExactSuggestion = suggestions.some(
    (ingredient) => normalizeIngredientName(ingredient) === cleanQuery
  );
  const canAddCustom =
    cleanQuery.length > 0 && !value.includes(cleanQuery) && !hasExactSuggestion;
  const visibleOptionsCount = suggestions.length + (canAddCustom ? 1 : 0);
  const activeSuggestion =
    highlightedIndex < suggestions.length
      ? suggestions[highlightedIndex]
      : cleanQuery;

  return (
    <div ref={containerRef}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200"
      >
        Ingredients
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={query}
          placeholder="Type an ingredient"
          enterKeyHint="done"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={(e) => {
            const goUp = () => {
              e.preventDefault();
              if (visibleOptionsCount === 0) return;
              setDropdownOpen(true);
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : visibleOptionsCount - 1
              );
            };

            const goDown = () => {
              e.preventDefault();
              if (visibleOptionsCount === 0) return;
              setDropdownOpen(true);
              setHighlightedIndex((prev) =>
                prev < visibleOptionsCount - 1 ? prev + 1 : 0
              );
            };

            if (e.key === "ArrowUp") {
              goUp();
            } else if (e.key === "ArrowDown") {
              goDown();
            } else if (e.key === "Escape") {
              setDropdownOpen(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              addIngredient(
                dropdownOpen && visibleOptionsCount > 0 ? activeSuggestion : query
              );
            }
          }}
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => addIngredient(query)}
          disabled={!cleanQuery || value.includes(cleanQuery)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-blue-200 bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 dark:border-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:border-gray-700 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
          aria-label={
            cleanQuery
              ? `Add ${formatIngredientName(cleanQuery)} as an ingredient`
              : "Add ingredient"
          }
          title="Add ingredient"
        >
          <Plus size={18} />
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Choose a suggestion, or tap + to add your own ingredient.
      </p>

      {dropdownOpen && visibleOptionsCount > 0 && (
        <>
          {(itemRefs.current = [])}
          <div className="bg-white dark:bg-gray-800 border rounded shadow mt-1 max-h-40 overflow-y-auto z-10 relative">
            {suggestions.map((item, index) => (
              <button
                type="button"
                key={item}
                ref={(el) => {
                  if (el) itemRefs.current[index] = el;
                }}
                onClick={() => addIngredient(item)}
                className={`block w-full px-3 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  index === highlightedIndex
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
              >
                {formatIngredientName(item)}
              </button>
            ))}
            {canAddCustom && (
              <button
                type="button"
                ref={(el) => {
                  if (el) itemRefs.current[suggestions.length] = el;
                }}
                onClick={() => addIngredient(cleanQuery)}
                className={`block w-full border-t border-gray-100 px-3 py-2 text-left text-yellow-800 hover:bg-yellow-50 dark:border-gray-700 dark:text-yellow-300 dark:hover:bg-yellow-950 ${
                  highlightedIndex === suggestions.length
                    ? "bg-yellow-50 dark:bg-yellow-950"
                    : ""
                }`}
              >
                Add custom ingredient:{" "}
                <span className="font-medium">
                  {formatIngredientName(cleanQuery)}
                </span>
              </button>
            )}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {value.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => removeIngredient(item)}
            className={`inline-flex items-center gap-1 cursor-pointer rounded-full px-3 py-1 text-sm transition-colors duration-200 ${
              isRecognized(item)
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-700"
                : "border border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700"
            }`}
            aria-label={`Remove ${formatIngredientName(item)}`}
            title={
              isRecognized(item)
                ? "Click to remove"
                : "Custom ingredient (click to remove)"
            }
          >
            {formatIngredientName(item)} <X size={13} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-300 dark:bg-blue-800"></span>
          Recognized
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-300 dark:bg-yellow-800"></span>
          Not Recognized
        </div>
      </div>
    </div>
  );
}
