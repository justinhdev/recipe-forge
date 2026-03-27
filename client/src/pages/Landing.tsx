import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
        Welcome to Recipe Forge
      </h1>
      <p className="max-w-xl px-2 sm:px-0 text-lg sm:text-xl mb-8 text-gray-700 dark:text-gray-300">
        Generate healthy recipes from the ingredients you
        have, with macros tailored to your goals.
      </p>
      <Link
        to="/login"
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
      >
        Get Started
      </Link>
    </div>
  );
}
