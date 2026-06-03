"use client";

import type React from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Home, Wallet, List, Settings, Sun, Moon, LogOut } from "lucide-react";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="border-b border-slate-200/60 bg-[#FAF8F3]/80 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0F172A]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 md:py-4">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/40 md:h-10 md:w-10 md:rounded-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 text-white md:h-6 md:w-6"
              >
                <path
                  d="M4 11a6 6 0 0 1 6-6h4.5A3.5 3.5 0 0 1 18 8.5V9h1a1 1 0 0 1 1 1v1.5a.5.5 0 0 1-.5.5H19l-.3 1.5a5 5 0 0 1-4.9 4H9a5 5 0 0 1-5-5v-1a1 1 0 0 1 1-1Z"
                  fill="currentColor"
                />
                <circle cx="9" cy="11" r="1" fill="#FACC15" />
                <circle cx="14" cy="11" r="1" fill="#FACC15" />
              </svg>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-lg">
              💰 Savings Tracker
            </span>
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
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-slate-900/5 px-0.5 text-slate-600 shadow-inner dark:bg-slate-700/80 dark:text-slate-200 md:h-9 md:w-16 md:px-1"
            >
              <span className="pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md shadow-slate-900/20 transition-transform dark:translate-x-5 dark:bg-slate-900 md:h-7 md:w-7 md:dark:translate-x-7">
                <Sun className="h-3 w-3 stroke-[1.5] dark:hidden md:h-4 md:w-4" />
                <Moon className="hidden h-3 w-3 stroke-[1.5] dark:block md:h-4 md:w-4" />
              </span>
            </button>

            {/* User info + logout (desktop) */}
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
                onClick={() => setShowLogoutConfirm(true)}
                className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                aria-label="Déconnexion"
              >
                <LogOut className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Mobile logout button */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-md shadow-slate-900/10 dark:bg-slate-900/80 dark:text-slate-400 md:hidden"
              aria-label="Déconnexion"
            >
              <LogOut className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex flex-col items-center gap-1 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                <LogOut className="h-5 w-5 stroke-[1.5] text-red-500" />
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Se déconnecter ?
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tu devras te reconnecter pour accéder à ton compte.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setShowLogoutConfirm(false); onLogout?.(); }}
                className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Se déconnecter
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-[#FAF8F3]/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0F172A]/95 md:hidden">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 px-2 py-2 text-[9px] font-medium transition-colors ${
                  isActive
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-orange-500/10 dark:bg-orange-500/20"
                      : ""
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} />
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
