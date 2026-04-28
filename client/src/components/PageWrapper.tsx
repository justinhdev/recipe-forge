import Navbar from "./Navbar";
import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
