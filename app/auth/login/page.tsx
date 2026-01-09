import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      {/* Colonne illustration / pitch (desktop uniquement) */}
      <AuthSidebar />

      {/* Colonne formulaire */}
      <main className="flex min-h-screen flex-1 flex-col justify-between px-4 py-6 sm:px-6 lg:px-10">
        {/* Header compact mobile */}
        <AuthHeader />

        {/* Contenu principal : Login / Register */}
        <AuthForm />

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between text-xs font-normal text-slate-500 dark:text-slate-400">
          <span>App privée — épargne couple</span>
          <span>V1.0 — Authentification</span>
        </footer>
      </main>
    </div>
  );
}
