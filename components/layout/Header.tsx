"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Home, Wallet, List, Settings, Menu, X, Sun, Moon, LogOut } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "accounts", label: "Comptes", icon: Wallet },
  { id: "contributions", label: "Historique", icon: List },
  { id: "settings", label: "Paramètres", icon: Settings },
];

interface HeaderProps {
  activeRoute?: string;
  userName?: string;
  userInitial?: string;
  userRole?: string;
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
}

export function Header({
  activeRoute = "dashboard",
  userName = "Tristan",
  userInitial = "T",
  userRole = "Couple privé",
  onNavigate,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      // Default navigation behavior
      window.location.href = `/${route}`;
    }
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-slate-200/60 bg-[#FAF8F3]/80 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0F172A]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        {/* Logo + Brand */}
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
              />
              <circle cx="9" cy="11" r="1" fill="#FACC15" />
              <circle cx="14" cy="11" r="1" fill="#FACC15" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              💰 Savings Tracker
            </span>
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              Apport immobilier 40 000&nbsp;€ d'ici 2028
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 rounded-full bg-white/80 p-1 shadow-lg shadow-slate-900/5 dark:bg-slate-900/70 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-300"
                    : "text-slate-600 hover:bg-orange-500/10 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-300"
                }`}
              >
                <Icon className="h-4 w-4 stroke-[1.5]" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: theme toggle + user */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative inline-flex h-9 w-16 items-center rounded-full bg-slate-900/5 px-1 text-slate-600 shadow-inner dark:bg-slate-700/80 dark:text-slate-200"
          >
            <span className="pointer-events-none inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md shadow-slate-900/20 transition-transform dark:translate-x-7 dark:bg-slate-900">
              <Sun className="h-4 w-4 stroke-[1.5] dark:hidden" />
              <Moon className="hidden h-4 w-4 stroke-[1.5] dark:block" />
            </span>
          </button>

          {/* User info (desktop) */}
          <div className="hidden items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-md shadow-slate-900/5 dark:bg-slate-900/80 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-orange-500 to-amber-400 text-xs font-semibold text-white">
              {userInitial}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {userName}
              </span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                {userRole}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              aria-label="Déconnexion"
            >
              <LogOut className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md shadow-slate-900/10 dark:bg-slate-900/80 dark:text-slate-200 md:hidden"
            aria-label={mobileMenuOpen ? "Fermer la navigation" : "Ouvrir la navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 stroke-[1.5]" />
            ) : (
              <Menu className="h-5 w-5 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/70 bg-[#FAF8F3]/95 px-4 pb-4 pt-2 shadow-sm dark:border-slate-800 dark:bg-[#020617]/95 md:hidden">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-tr from-orange-500 to-amber-400 text-xs font-semibold text-white">
              {userInitial}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {userName}
              </span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                @{userName.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300"
                      : "text-slate-700 hover:bg-orange-500/10 hover:text-orange-700 dark:text-slate-200 dark:hover:bg-orange-500/15 dark:hover:text-orange-300"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-slate-900/5 dark:bg-slate-700/70"
                    }`}
                  >
                    <Icon className="h-4 w-4 stroke-[1.5]" />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
