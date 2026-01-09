"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function AuthSidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="relative hidden w-full max-w-md flex-col justify-between border-r border-slate-200/60 bg-[#FAF8F3]/90 px-8 py-8 dark:border-slate-800 dark:bg-[#020617]/90 lg:flex">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 text-white"
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
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            💰 Savings Tracker
          </span>
          <span className="text-base font-normal text-slate-500 dark:text-slate-400">
            Apport immobilier 40 000&nbsp;€ d'ici 2028
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

      <main className="mt-10 space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Suivez votre épargne à deux, sereinement.
          </h1>
          <p className="text-lg font-normal text-slate-600 dark:text-slate-300">
            Visualisez l'avancement de votre apport immobilier, centralisez vos comptes et
            automatisez vos versements, dans une interface simple et chaleureuse.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-white/90 p-4 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200/80 dark:bg-slate-900/90 dark:ring-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Objectif apport
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                40 000&nbsp;€
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              En route pour 2028
            </div>
          </div>

          <div className="mt-2 space-y-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-lime-400 shadow-[0_0_0_1px_rgba(15,23,42,0.08)]"></div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>26 000&nbsp;€ déjà épargnés</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">65&nbsp;% atteint</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-10 flex items-center justify-between text-xs font-normal text-slate-500 dark:text-slate-400">
        <span>App privée – couple</span>
        <span>V1.0 – Dashboard, Comptes, Historique</span>
      </footer>
    </aside>
  );
}
