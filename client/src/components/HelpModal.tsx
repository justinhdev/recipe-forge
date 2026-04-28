import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 py-3 sm:items-center sm:px-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-800 shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 sm:max-h-[90vh] sm:p-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close Help"
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              <X size={14} />
            </button>

            <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-white pr-8">
              How Recipe Generation Works
            </h2>

            <ul className="space-y-3 leading-relaxed">
              {[
                <>
                  Enter ingredients like{" "}
                  <em className="text-gray-600 dark:text-gray-300">
                    "chicken"
                  </em>
                  ,{" "}
                  <em className="text-gray-600 dark:text-gray-300">
                    "broccoli"
                  </em>
                  , or{" "}
                  <em className="text-gray-600 dark:text-gray-300">
                    "olive oil"
                  </em>
                  .
                </>,
                <>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Blue tags
                  </span>{" "}
                  are recognized ingredients from our list.
                </>,
                <>
                  <span className="font-semibold text-yellow-500">
                    Yellow tags
                  </span>{" "}
                  are custom ingredients — they still work great.
                </>,
                <>
                  Hit{" "}
                  <strong className="text-gray-900 dark:text-white">
                    Generate Recipe
                  </strong>{" "}
                  to get a full recipe with macros.
                </>,
                <>
                  Save recipes to revisit them anytime in{" "}
                  <strong className="text-gray-900 dark:text-white">
                    My Recipes
                  </strong>
                  .
                </>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-xs font-bold text-blue-600 dark:text-blue-400">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
