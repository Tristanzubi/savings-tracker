import React from "react";

interface ContributionItemProps {
  amount: number;
  accountName: string;
  date: string;
  label: string;
}

export function ContributionItem({
  amount,
  accountName,
  date,
  label,
}: ContributionItemProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR");
  };

  return (
    <div className="flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/70">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
          +{formatCurrency(amount)}&nbsp;€ sur {accountName}
        </p>
        <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
          {date} · {label}
        </p>
      </div>
      <span className="text-sm font-medium text-emerald-500 dark:text-emerald-400">
        +{formatCurrency(amount)}&nbsp;€
      </span>
    </div>
  );
}
