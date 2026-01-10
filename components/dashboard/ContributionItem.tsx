import React from "react";
import { Edit3 } from "lucide-react";

interface ContributionItemProps {
  amount: number;
  accountName: string;
  date: string;
  label: string;
  onEdit?: () => void;
}

export function ContributionItem({
  amount,
  accountName,
  date,
  label,
  onEdit,
}: ContributionItemProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR");
  };

  return (
    <div className="group flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/70">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
          +{formatCurrency(amount)}&nbsp;€ sur {accountName}
        </p>
        <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
          {date} · {label}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-emerald-500 dark:text-emerald-400">
          +{formatCurrency(amount)}&nbsp;€
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-slate-400 transition hover:text-orange-600 dark:hover:text-orange-400"
            title="Modifier ce versement"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
