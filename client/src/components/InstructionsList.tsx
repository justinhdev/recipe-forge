import { motion } from "framer-motion";
import { parseInstructions } from "../utils/parseInstructions";

export default function InstructionsList({
  instructions,
}: {
  instructions: string;
}) {
  const steps = parseInstructions(instructions);

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="flex items-start gap-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2"
        >
          <div className="flex-none w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-xs flex items-center justify-center">
            {i + 1}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {step}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
