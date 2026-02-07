"use client";

import type React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProjectCardProps {
  projectName: string;
  emoji?: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  allocatedFromAccounts: Array<{
    accountName: string;
    amount: number;
  }>;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onViewDetails?: () => void;
}

export function ProjectCard({
  projectName,
  emoji = "🎯",
  currentAmount,
  targetAmount,
  progress,
  allocatedFromAccounts,
  status,
  isExpanded = false,
  onToggleExpand,
  onViewDetails,
}: ProjectCardProps) {
  const statusColors = {
    ACTIVE: "bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
    COMPLETED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    ARCHIVED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  const statusLabels = {
    ACTIVE: "En cours",
    COMPLETED: "Terminé",
    ARCHIVED: "Archivé",
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
      {/* Main card content - always visible */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Emoji + Title */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-3xl dark:bg-orange-950">
              {emoji}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {projectName}
              </h3>
              <span
                className={`mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
            </div>
          </div>

          {/* Right: Toggle button */}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={isExpanded ? "Réduire" : "Développer"}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Progress section */}
        <div className="mt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {currentAmount.toLocaleString("fr-FR")} €
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              sur {targetAmount.toLocaleString("fr-FR")} €
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-orange-500 via-orange-400 to-amber-300 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-orange-600 dark:text-orange-400">
              {progress}% atteint
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {(targetAmount - currentAmount).toLocaleString("fr-FR")} € restants
            </span>
          </div>
        </div>
      </div>

      {/* Expandable section - Allocations */}
      {isExpanded && allocatedFromAccounts.length > 0 && (
        <div className="border-t border-slate-200/70 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Allocations par compte
          </h4>
          <div className="space-y-2">
            {allocatedFromAccounts.map((allocation, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-800"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {allocation.accountName}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  {allocation.amount.toLocaleString("fr-FR")} €
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer - Details button */}
      {onViewDetails && (
        <div className="border-t border-slate-200/70 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={onViewDetails}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            Gérer les allocations →
          </button>
        </div>
      )}
    </div>
  );
}
