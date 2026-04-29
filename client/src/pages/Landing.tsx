import { Link } from "react-router-dom";

const features = [
  {
    icon: "🥦",
    title: "Pick Ingredients",
    desc: "Choose what you have on hand — no shopping required",
  },
  {
    icon: "⚡",
    title: "Generate Instantly",
    desc: "AI crafts a full recipe in seconds, tuned to your preferences",
  },
  {
    icon: "📊",
    title: "Track Macros",
    desc: "Every recipe includes calories, protein, carbs & fat breakdowns",
  },
];

const sampleMacros = [
  { label: "52g protein", bg: "bg-blue-50", text: "text-blue-700" },
  { label: "18g fat", bg: "bg-yellow-50", text: "text-yellow-700" },
  { label: "12g carbs", bg: "bg-green-50", text: "text-green-700" },
  { label: "410 kcal", bg: "bg-purple-50", text: "text-purple-700" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-6 py-16 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-100 opacity-40 dark:bg-blue-900" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-green-100 opacity-40 dark:bg-green-900" />

        <div className="relative mx-auto max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            ✨ AI-powered recipe generation
          </span>

          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Cook smarter with{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Recipe Forge
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Tell us what's in your fridge. Get a personalized recipe with macros
            tailored to your goals in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/generate"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:shadow-none dark:hover:bg-blue-500"
            >
              Generate Your First Recipe →
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            {[
              "No credit card needed",
              "Works with any ingredients",
              "Free to use",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center gap-2 px-6 py-8 text-center bg-white dark:bg-gray-900"
          >
            <span className="text-3xl">{f.icon}</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {f.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Sample output preview */}
      <div className="flex flex-col items-center px-6 py-12 bg-gray-50 dark:bg-gray-800/50">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Sample Output
        </p>
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-green-500" />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🍳</span>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  Spinach & Egg Frittata
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Generated from: eggs, spinach, feta
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {sampleMacros.map(({ label, bg, text }) => (
                <span
                  key={label}
                  className={`${bg} ${text} rounded-full px-2.5 py-1 text-xs font-semibold dark:bg-opacity-20`}
                >
                  {label}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              1. Preheat oven to 375°F. 2. Whisk eggs with salt and pepper. 3.
              Sauté garlic and spinach…
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
