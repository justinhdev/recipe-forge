import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme, saveTheme } from "../utils/theme";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(() => getInitialTheme() === "dark");

  useEffect(() => {
    applyTheme(isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDark = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    saveTheme(newValue ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isDark ? "Dark" : "Light"}
      </span>
      <button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isDark ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
