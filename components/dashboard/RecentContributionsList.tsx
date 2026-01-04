import React from "react";
import { Plus } from "lucide-react";
import { ContributionItem } from "./ContributionItem";

interface Contribution {
  id: string;
  amount: number;
  accountName: string;
  date: string;
  label: string;
}

interface RecentContributionsListProps {
  contributions: Contribution[];
  onAdd?: () => void;
  onViewAll?: () => void;
}

export function RecentContributionsList({
  contributions,
  onAdd,
  onViewAll,
}: RecentContributionsListProps) {
  return (
    <section
      aria-labelledby="latest-contributions-title"
      className="col-span-1 flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2
            id="latest-contributions-title"
            className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Derniers versements
          </h2>
          <p className="text-base font-normal text-slate-500 dark:text-slate-400">
            Vos {contributions.length} mouvements les plus récents.
          </p>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/40 transition hover:bg-orange-600"
            aria-label="Ajouter un versement"
          >
            <Plus className="h-4 w-4 stroke-[1.5]" />
          </button>
        )}
      </div>

      {/* List */}
      <div className="mt-2 space-y-2">
        {contributions.map((contribution) => (
          <ContributionItem
            key={contribution.id}
            amount={contribution.amount}
            accountName={contribution.accountName}
            date={contribution.date}
            label={contribution.label}
          />
        ))}
      </div>

      {/* Footer */}
      {onViewAll && (
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-300"
          >
            Voir tout l'historique →
          </button>
        </div>
      )}
    </section>
  );
}
