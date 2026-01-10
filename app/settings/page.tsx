"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Header } from "@/components/layout/Header";
import { settingsApi } from "@/lib/api-client";
import {
  CheckCircle,
  User,
  Sun,
  Moon,
  Trash2,
  ChevronDown,
  Calendar
} from "lucide-react";

export default function SettingsPage() {
  const [activeRoute] = useState("settings");
  const { theme, setTheme } = useTheme();

  const [goalAmount, setGoalAmount] = useState("40000");
  const [targetDate, setTargetDate] = useState("2028-12-31");
  const [userName, setUserName] = useState("Tristan");
  const [userEmail, setUserEmail] = useState("tristan@example.com");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.get();
        if (data) {
          if (data.goal) setGoalAmount(data.goal.toString());
          if (data.targetDate) {
            const date = new Date(data.targetDate);
            const formattedDate = date.toISOString().split('T')[0];
            setTargetDate(formattedDate);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await settingsApi.update({
        goal: parseFloat(goalAmount),
        targetDate: new Date(targetDate).toISOString(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    console.log("Modifier le profil:", { userName });
    // TODO: Mettre à jour le profil via API
  };

  const handleDeleteAccount = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      console.log("Supprimer le compte");
      // TODO: Supprimer le compte
    }
  };

  const handleResetData = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.")) {
      console.log("Réinitialiser les données");
      // TODO: Réinitialiser les données
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header activeRoute={activeRoute} onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="space-y-6">
          {/* Page Header */}
          <header className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Paramètres
            </h2>
            <p className="text-lg font-normal text-slate-600 dark:text-slate-300">
              Ajustez l'objectif, le profil et les préférences d'affichage.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Goal Configuration */}
            <section className="col-span-1 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                    <CheckCircle className="h-4 w-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Configuration de l'objectif
                    </h3>
                    <p className="text-base font-normal text-slate-500 dark:text-slate-400">
                      Ces valeurs sont utilisées pour tous les calculs automatiques.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="target-amount"
                  >
                    Montant cible
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
                    <input
                      id="target-amount"
                      type="number"
                      inputMode="decimal"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      disabled={isLoading}
                      className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400 disabled:opacity-50"
                      aria-label="Montant cible en euros"
                    />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      €
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    L'objectif total de votre épargne immobilière.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="target-date"
                  >
                    Date cible
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
                    <Calendar className="h-4 w-4 stroke-[1.5] text-slate-400 dark:text-slate-500" />
                    <input
                      id="target-date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      disabled={isLoading}
                      className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isSaving || isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-slate-900/40 transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    {isSaving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
                  </button>
                  {saveSuccess && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      ✓ Paramètres sauvegardés avec succès
                    </p>
                  )}
                  {saveError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ✗ {saveError}
                    </p>
                  )}
                </div>
              </form>
            </section>

            {/* Right Column */}
            <div className="space-y-4">
              {/* User Profile */}
              <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-700">
                    <User className="h-4 w-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Profil utilisateur
                    </h3>
                    <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      Synchronisé avec Better Auth.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Nom
                    </p>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Email (lecture seule)
                    </p>
                    <p className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                      {userEmail}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md shadow-slate-900/40 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Modifier le profil
                  </button>
                </div>
              </section>

              {/* Preferences */}
              <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Préférences
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        Mode sombre
                      </p>
                      <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        Utilise la bascule globale de l'application.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-900/5 px-1 text-slate-600 shadow-inner dark:bg-slate-700/80 dark:text-slate-200"
                    >
                      <span className="pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-700 shadow-md shadow-slate-900/20 transition-transform dark:translate-x-6 dark:bg-slate-900 dark:text-amber-300">
                        <Sun className="h-3.5 w-3.5 stroke-[1.5] dark:hidden" />
                        <Moon className="hidden h-3.5 w-3.5 stroke-[1.5] dark:block" />
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Langue
                    </label>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      Français
                      <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="flex flex-col gap-3 rounded-3xl bg-rose-50/80 p-5 shadow-lg shadow-rose-200/60 ring-1 ring-rose-200/80 dark:bg-rose-950/40 dark:ring-rose-900">
                <h3 className="text-lg font-semibold tracking-tight text-rose-700 dark:text-rose-200">
                  Zone de danger
                </h3>
                <p className="text-sm font-normal text-rose-700/80 dark:text-rose-200/80">
                  Actions irréversibles liées à votre compte et à vos données.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-rose-600/40 hover:bg-rose-700"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    Supprimer mon compte
                  </button>
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-500/20 dark:bg-rose-500/15 dark:text-rose-200 dark:hover:bg-rose-500/30"
                  >
                    Réinitialiser toutes les données
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
