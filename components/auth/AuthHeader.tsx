"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function AuthHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="mb-8 flex items-center justify-between lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 text-white"
          >
            <path
              d="M4 11a6 6 0 0 1 6-6h4.5A3.5 3.5 0 0 1 18 8.5V9h1a1 1 0 0 1 1 1v1.5a.5.5 0 0 1-.5.5H19l-.3 1.5a5 5 0 0 1-4.9 4H9a5 5 0 0 1-5-5v-1a1 1 0 0 1 1-1Z"
              fill="currentColor"
            ></path>
            <circle cx="9" cy="11" r="1" fill="#FACC15"></circle>
            <circle cx="14" cy="11" r="1" fill="#FACC15"></circle>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            💰 Savings Tracker
          </span>
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
            Apport immobilier 40 000&nbsp;€
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-900/5 px-1 text-slate-600 shadow-inner dark:bg-slate-700/80 dark:text-slate-200"
      >
        <span className="pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md shadow-slate-900/20 transition-transform dark:translate-x-6 dark:bg-slate-900">
          <Sun className="h-4 w-4 stroke-[1.5] dark:hidden" />
          <Moon className="hidden h-4 w-4 stroke-[1.5] dark:block" />
        </span>
      </button>
    </header>
  );
}
