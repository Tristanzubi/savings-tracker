"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/client";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

type AuthMode = "login" | "register";

interface AuthFormProps {
  onSubmit?: (mode: AuthMode, data: FormData) => void;
  onDemoClick?: () => void;
}

// Create Better Auth client
const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export function AuthForm({ onSubmit, onDemoClick }: AuthFormProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLogin = authMode === "login";

  // Switch mode handler - clear errors when switching
  const handleModeSwitch = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrors({});
  };

  // Client-side validation
  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const passwordConfirm = formData.get("password-confirm") as string;

    // Email validation
    if (!email || !email.includes("@")) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide";
    }

    // Password validation
    if (!password || password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Register mode validations
    if (!isLogin) {
      // Name validation
      if (!name || name.length < 3) {
        newErrors.name = "Le prénom doit contenir au moins 3 caractères";
      }

      // Password confirmation validation
      if (password !== passwordConfirm) {
        newErrors["password-confirm"] = "Les mots de passe ne correspondent pas";
      }

      // Terms acceptance validation
      if (!termsAccepted) {
        newErrors.terms = "Vous devez accepter les conditions d'utilisation";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // If custom onSubmit handler provided, use it
    if (onSubmit) {
      onSubmit(authMode, formData);
      return;
    }

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (isLogin) {
        // Login flow
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          console.error("Login error:", result.error);
          setErrors({
            general: "Identifiants incorrects. Veuillez vérifier votre e-mail et mot de passe.",
          });
          return;
        }

        // Success - redirect to dashboard
        console.log("Login successful:", result);
        router.push("/dashboard");
      } else {
        // Register flow
        const name = formData.get("name") as string;

        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          console.error("Registration error:", result.error);

          // Handle specific error cases
          if (result.error.message?.includes("already exists") ||
              result.error.message?.includes("duplicate")) {
            setErrors({
              general: "Un compte existe déjà avec cette adresse e-mail.",
            });
          } else {
            setErrors({
              general: "Une erreur est survenue lors de la création du compte. Veuillez réessayer.",
            });
          }
          return;
        }

        // Success - redirect to dashboard
        console.log("Registration successful:", result);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({
        general: "Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    if (onDemoClick) {
      onDemoClick();
    } else {
      // Redirect to dashboard in demo mode
      router.push("/dashboard");
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (fieldName: string) => {
    if (errors[fieldName] || errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col">
      <div className="mb-6 inline-flex items-center self-start rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-100 shadow-md shadow-slate-900/40 dark:bg-slate-800">
        <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        <span>{isLogin ? "Connexion" : "Inscription"}</span>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {isLogin ? "Connectez-vous à votre espace" : "Créez votre espace d'épargne"}
        </h1>
        <p className="text-lg font-normal text-slate-600 dark:text-slate-300">
          {isLogin
            ? "Retrouvez votre dashboard d'épargne, vos comptes et l'historique de vos versements."
            : "Invitez votre partenaire, définissez votre objectif d'apport et commencez à suivre votre épargne ensemble."}
        </p>
      </header>

      <div className="mt-6 flex gap-1 rounded-full bg-slate-900/5 p-1 text-sm font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
        <button
          type="button"
          onClick={() => handleModeSwitch("login")}
          disabled={isLoading}
          className={`flex-1 rounded-full px-3 py-1.5 text-center transition disabled:opacity-50 ${
            isLogin
              ? "bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700"
              : "hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("register")}
          disabled={isLoading}
          className={`flex-1 rounded-full px-3 py-1.5 text-center transition disabled:opacity-50 ${
            !isLogin
              ? "bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700"
              : "hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Créer un compte
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* General error message */}
        {errors.general && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 dark:border-red-800/50 dark:bg-red-900/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-300">
                {errors.general}
              </p>
            </div>
          </div>
        )}

        {/* Champ nom (inscription) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Prénom
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4 stroke-[1.5]" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                disabled={isLoading}
                onChange={() => handleInputChange("name")}
                className={`block w-full rounded-2xl border py-2.5 pl-9 pr-3 text-base font-normal shadow-sm shadow-slate-900/5 outline-none ring-0 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.name
                    ? "border-red-300 bg-red-50/50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/10 dark:text-slate-50 dark:focus:border-red-400 dark:focus:ring-red-400/30"
                    : "border-slate-200 bg-white/90 text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
                }`}
                placeholder="Ex : Tristan"
              />
            </div>
            {errors.name && (
              <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </div>
            )}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-800 dark:text-slate-100"
          >
            Adresse e‑mail
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="h-4 w-4 stroke-[1.5]" />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              onChange={() => handleInputChange("email")}
              className={`block w-full rounded-2xl border py-2.5 pl-9 pr-3 text-base font-normal shadow-sm shadow-slate-900/5 outline-none ring-0 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email
                  ? "border-red-300 bg-red-50/50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/10 dark:text-slate-50 dark:focus:border-red-400 dark:focus:ring-red-400/30"
                  : "border-slate-200 bg-white/90 text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
              }`}
              placeholder="vous@exemple.com"
              required
            />
          </div>
          {errors.email && (
            <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Mot de passe */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Mot de passe
            </label>
            {isLogin && (
              <button
                type="button"
                className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-4 w-4 stroke-[1.5]" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isLoading}
              onChange={() => handleInputChange("password")}
              className={`block w-full rounded-2xl border py-2.5 pl-9 pr-10 text-base font-normal shadow-sm shadow-slate-900/5 outline-none ring-0 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password
                  ? "border-red-300 bg-red-50/50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/10 dark:text-slate-50 dark:focus:border-red-400 dark:focus:ring-red-400/30"
                  : "border-slate-200 bg-white/90 text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50"
              aria-label="Afficher le mot de passe"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 stroke-[1.5]" />
              ) : (
                <Eye className="h-4 w-4 stroke-[1.5]" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirmation mot de passe (inscription) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <label
              htmlFor="password-confirm"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
              </span>
              <input
                id="password-confirm"
                name="password-confirm"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                onChange={() => handleInputChange("password-confirm")}
                className={`block w-full rounded-2xl border py-2.5 pl-9 pr-3 text-base font-normal shadow-sm shadow-slate-900/5 outline-none ring-0 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors["password-confirm"]
                    ? "border-red-300 bg-red-50/50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/10 dark:text-slate-50 dark:focus:border-red-400 dark:focus:ring-red-400/30"
                    : "border-slate-200 bg-white/90 text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
                }`}
                placeholder="Répétez votre mot de passe"
              />
            </div>
            {errors["password-confirm"] && (
              <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors["password-confirm"]}
              </div>
            )}
          </div>
        )}

        {/* Rappel / CGU */}
        {!isLogin && (
          <div>
            <div className="flex items-start gap-3 text-xs font-normal text-slate-500 dark:text-slate-400">
              <div className="relative mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-600 dark:bg-slate-900">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isLoading}
                  className="peer absolute h-4 w-4 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
                <Check
                  className={`pointer-events-none h-3 w-3 stroke-[1.5] text-orange-500 transition-opacity ${
                    termsAccepted ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <label htmlFor="terms" className="cursor-pointer">
                En créant un compte, vous acceptez que cette application soit utilisée à titre privé
                et personnel.
              </label>
            </div>
            {errors.terms && (
              <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-2 ml-7">
                <AlertCircle className="h-3 w-3" />
                {errors.terms}
              </div>
            )}
          </div>
        )}

        {/* Bouton principal */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-2.5 text-base font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-orange-500 dark:hover:bg-orange-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 stroke-[1.5] animate-spin" />
              <span>{isLogin ? "Connexion en cours..." : "Création du compte..."}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
              <ArrowRight className="h-4 w-4 stroke-[1.5]" />
            </>
          )}
        </button>

        {/* Bouton secondaire : login magic / démo */}
        <button
          type="button"
          onClick={handleDemo}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/90 py-2.5 text-base font-medium text-slate-700 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/80 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-900/80 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-900"
        >
          <Sparkles className="h-4 w-4 stroke-[1.5] text-orange-500" />
          <span>Ouvrir une démo (sans compte)</span>
        </button>
      </form>

      {/* Lien inverse Connexion / Inscription */}
      <p className="mt-6 text-center text-sm font-normal text-slate-600 dark:text-slate-300">
        {isLogin ? "Pas encore de compte ? " : "Vous avez déjà un compte ? "}
        <button
          type="button"
          onClick={() => handleModeSwitch(isLogin ? "register" : "login")}
          disabled={isLoading}
          className="font-medium text-orange-600 underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed dark:text-orange-300"
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </section>
  );
}
