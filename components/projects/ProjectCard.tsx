"use client";

import React from "react";
import { ChevronDown, Calendar, Wallet, Pencil, Trash2 } from "lucide-react";

interface ProjectCardProps {
  projectName: string;
  emoji?: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  targetDate?: string;
  allocatedFromAccounts?: Array<{
    accountName: string;
    amount: number;
  }>;
  status?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onManageAllocations?: () => void;
}

export function ProjectCard({
  projectName,
  emoji = "🎯",
  currentAmount,
  targetAmount,
  progress,
  targetDate,
  allocatedFromAccounts: _allocatedFromAccounts = [],
  status = "ACTIVE",
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onDelete,
  onManageAllocations,
}: ProjectCardProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR");
  };

  // Calculate deadline info
  const now = new Date();
  const deadline = targetDate ? new Date(targetDate) : null;
  const deadlineFormatted = deadline
    ? deadline.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Non définie";

  const monthsRemaining = deadline
    ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : 0;

  const remainingToSave = Math.max(0, targetAmount - currentAmount);
  const monthlyRequired = monthsRemaining > 0 ? remainingToSave / monthsRemaining : 0;

  // Status badge
  const statusConfig = {
    ACTIVE: { label: "En cours", color: "bg-lime-500/20 text-lime-700 dark:text-lime-300" },
    COMPLETED: {
      label: "Terminé",
      color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    },
    ARCHIVED: {
      label: "Archivé",
      color: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;

  if (!isExpanded) {
    // Compact version
    return (
      <div
        onClick={onToggleExpand}
        className="group cursor-pointer rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 transition hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {projectName}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${currentStatus.color}`}
                >
                  {currentStatus.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatCurrency(currentAmount)} € sur {formatCurrency(targetAmount)} €
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{progress}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(remainingToSave)} € restants
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-400 transition group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </div>
        </div>

        {/* Compact progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-lime-400 via-orange-400 to-amber-300 shadow-sm"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Expanded version - compact design
  return (
    <div className="rounded-3xl bg-linear-to-br from-orange-500 via-orange-400 to-amber-300 p-5 text-slate-900 shadow-lg shadow-orange-500/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/20 text-lg">
            {emoji}
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                {projectName}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${currentStatus.color}`}
              >
                {currentStatus.label}
              </span>
            </div>
            <p className="text-sm font-normal text-slate-900/80">
              Progression de votre projet d'épargne
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-medium text-slate-900/80">Objectif total</p>
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              {formatCurrency(targetAmount)}&nbsp;€
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-slate-900 transition hover:bg-white/30"
          >
            <ChevronDown className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-900/80">Épargne actuelle</p>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              {formatCurrency(currentAmount)}&nbsp;€
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-900/80">Progression</p>
            <p className="text-lg font-semibold text-slate-900">{progress}&nbsp;%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-900/80">
              <span className="text-sm">{emoji}</span>
              <span>0&nbsp;€</span>
            </div>
            <div className="flex items-center gap-1 text-slate-900/80">
              <span>{formatCurrency(targetAmount)}&nbsp;€</span>
              <span className="text-sm">🎯</span>
            </div>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/40 ring-1 ring-white/40">
            <div
              className="h-full rounded-full bg-linear-to-r from-lime-400 via-orange-400 to-amber-300 shadow-sm shadow-orange-700/40"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>
              {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}&nbsp;€
            </span>
            <span>Objectif: {deadlineFormatted}</span>
          </div>
        </div>

        {/* Stats - Similar to dashboard */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/20 p-2.5">
            <div className="flex items-center gap-1.5 text-slate-900/80">
              <span className="text-base">✓</span>
              <p className="text-xs font-medium">Il reste à épargner</p>
            </div>
            <p className="mt-1 text-base font-bold text-slate-900">
              {formatCurrency(remainingToSave)}&nbsp;€
            </p>
          </div>

          {deadline && (
            <>
              <div className="rounded-2xl bg-white/20 p-2.5">
                <div className="flex items-center gap-1.5 text-slate-900/80">
                  <Calendar className="h-3.5 w-3.5" />
                  <p className="text-xs font-medium">Mois restants</p>
                </div>
                <p className="mt-1 text-base font-bold text-slate-900">{monthsRemaining}</p>
              </div>

              <div className="rounded-2xl bg-white/20 p-2.5">
                <div className="flex items-center gap-1.5 text-slate-900/80">
                  <Wallet className="h-3.5 w-3.5" />
                  <p className="text-xs font-medium">Mensuel requis</p>
                </div>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {Math.round(monthlyRequired).toLocaleString("fr-FR")}&nbsp;€/mois
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action buttons (only if callbacks provided) */}
        {(onEdit || onDelete || onManageAllocations) && (
          <div className="mt-4 space-y-2">
            {onManageAllocations && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onManageAllocations();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-900/20 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-900/30"
              >
                <Wallet className="h-4 w-4" />
                Gérer les allocations
              </button>
            )}
            <div className="flex gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white/30"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
                      onDelete();
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-500/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
