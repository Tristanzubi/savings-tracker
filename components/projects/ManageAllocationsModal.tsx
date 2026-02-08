"use client";

import React from "react";
import { X } from "lucide-react";
import { AllocationManager } from "./AllocationManager";
import type { SavingsAccount } from "@/lib/api-client";

interface Allocation {
  id: string;
  accountId: string;
  accountName: string;
  allocatedAmount: number;
}

interface ManageAllocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  projectEmoji?: string;
  allocations: Allocation[];
  accounts: SavingsAccount[];
  onAddAllocation: (accountId: string, amount: number) => Promise<void>;
  onUpdateAllocation: (allocationId: string, amount: number) => Promise<void>;
  onDeleteAllocation: (allocationId: string) => Promise<void>;
}

export function ManageAllocationsModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  projectEmoji = "🎯",
  allocations,
  accounts,
  onAddAllocation,
  onUpdateAllocation,
  onDeleteAllocation,
}: ManageAllocationsModalProps) {
  if (!isOpen) return null;

  const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.allocatedAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{projectEmoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {projectName}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gérer les allocations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total alloué</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {totalAllocated.toLocaleString("fr-FR")} €
          </p>
        </div>

        <AllocationManager
          projectId={projectId}
          allocations={allocations}
          accounts={accounts}
          onAddAllocation={onAddAllocation}
          onUpdateAllocation={onUpdateAllocation}
          onDeleteAllocation={onDeleteAllocation}
        />

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
