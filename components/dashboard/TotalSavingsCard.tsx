import React from "react";

interface TotalSavingsCardProps {
  currentSavings: number;
  goal: number;
  percentage: number;
  deadline: string;
}

export function TotalSavingsCard({
  currentSavings,
  goal,
  percentage,
  deadline,
}: TotalSavingsCardProps) {
  const remaining = goal - currentSavings;

  // Format numbers with spaces as thousands separator
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR");
  };

  return (
    <div className="relative col-span-1 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 p-6 text-slate-900 shadow-lg shadow-orange-500/40 lg:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-xl">
              🏡
            </span>
            <div className="flex flex-col">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Objectif apport immobilier
              </h2>
              <p className="text-base font-normal text-slate-900/80">
                Progression globale de votre épargne dédiée.
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900/80">
            Objectif total
          </p>
          <p className="text-xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(goal)}&nbsp;€
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-900/80">
              Épargne actuelle
            </p>
            <p className="text-5xl font-extrabold tracking-tight text-slate-900">
              {formatCurrency(currentSavings)}&nbsp;€
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900/80">Progression</p>
            <p className="text-xl font-semibold text-slate-900">{percentage}&nbsp;%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-900/80">
              <span className="text-base">🏡</span>
              <span>0&nbsp;€</span>
            </div>
            <div className="flex items-center gap-1 text-slate-900/80">
              <span>{formatCurrency(goal)}&nbsp;€</span>
              <span className="text-base">🎯</span>
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-white/40 ring-1 ring-white/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lime-400 via-orange-400 to-amber-300 shadow-sm shadow-orange-700/40"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>{formatCurrency(currentSavings)} / {formatCurrency(goal)}&nbsp;€</span>
            <span>Objectif: {deadline}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
