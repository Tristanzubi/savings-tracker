import React from "react";

export type AccountType = "LEP" | "PEL" | "LDD" | "Livret A" | "Autre";

interface SavingsAccountCardProps {
  accountName: string;
  accountType: AccountType;
  balance: number;
  interestRate: number;
  createdAt: string;
  description?: string;
  emoji?: string;
  onViewDetails?: () => void;
}

export function SavingsAccountCard({
  accountName,
  balance,
  interestRate,
  createdAt,
  description = "Livret d'épargne populaire",
  emoji = "🏦",
  onViewDetails,
}: SavingsAccountCardProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR");
  };

  return (
    <div className="group flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 transition hover:ring-2 hover:ring-orange-500/50 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-orange-500/50">
      {/* Header: Name + Type badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {accountName}
            </h3>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
        <span className="inline-flex rounded-full bg-lime-500/10 px-2.5 py-1 text-xs font-medium text-lime-700 dark:bg-lime-500/20 dark:text-lime-300">
          {interestRate.toFixed(1)}&nbsp;%
        </span>
      </div>

      {/* Balance */}
      <div>
        <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
          Solde actuel
        </p>
        <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {formatCurrency(balance)}&nbsp;€
        </p>
      </div>

      {/* Footer: Created date + Details button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Créé le {createdAt}
        </p>
        <button
          type="button"
          onClick={onViewDetails}
          className="text-sm font-medium text-orange-600 transition hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
        >
          Détails →
        </button>
      </div>
    </div>
  );
}
