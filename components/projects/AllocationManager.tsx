"use client";

import React, { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import type { SavingsAccount } from "@/lib/api-client";

interface Allocation {
  id: string;
  accountId: string;
  accountName: string;
  allocatedAmount: number;
}

interface AllocationManagerProps {
  projectId: string;
  allocations: Allocation[];
  accounts: SavingsAccount[];
  onAddAllocation: (accountId: string, amount: number) => Promise<void>;
  onUpdateAllocation: (allocationId: string, amount: number) => Promise<void>;
  onDeleteAllocation: (allocationId: string) => Promise<void>;
}

export function AllocationManager({
  projectId: _projectId,
  allocations,
  accounts,
  onAddAllocation,
  onUpdateAllocation,
  onDeleteAllocation,
}: AllocationManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAllocationId, setEditingAllocationId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Calculate available balance for each account
  const getAvailableBalance = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return 0;

    // Sum all allocations for this account across all projects
    const totalAllocated = account.allocations?.reduce(
      (sum, alloc) => sum + alloc.allocatedAmount,
      0
    ) || 0;

    return account.currentBalance - totalAllocated;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Le montant doit être supérieur à 0");
      return;
    }

    const available = getAvailableBalance(selectedAccountId);
    if (amountNum > available) {
      setError(`Solde disponible insuffisant (${available.toLocaleString("fr-FR")} €)`);
      return;
    }

    try {
      if (editingAllocationId) {
        await onUpdateAllocation(editingAllocationId, amountNum);
        setEditingAllocationId(null);
      } else {
        await onAddAllocation(selectedAccountId, amountNum);
      }
      setShowAddForm(false);
      setSelectedAccountId("");
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (allocation: Allocation) => {
    setEditingAllocationId(allocation.id);
    setSelectedAccountId(allocation.accountId);
    setAmount(allocation.allocatedAmount.toString());
    setShowAddForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAllocationId(null);
    setSelectedAccountId("");
    setAmount("");
    setError("");
  };

  const availableAccounts = accounts.filter(
    (account) => !allocations.some((alloc) => alloc.accountId === account.id) || editingAllocationId
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Répartition par compte
        </h4>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-white/30"
          >
            <Plus className="h-3.5 w-3.5" />
            Allouer
          </button>
        )}
      </div>

      {/* Existing allocations */}
      {allocations.length > 0 && (
        <div className="space-y-2">
          {allocations.map((allocation) => (
            <div
              key={allocation.id}
              className="flex items-center justify-between rounded-2xl bg-white/20 p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{allocation.accountName}</p>
                <p className="text-xs text-slate-900/80">
                  {allocation.allocatedAmount.toLocaleString("fr-FR")} €
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(allocation)}
                  className="rounded-full p-1.5 text-slate-900 transition hover:bg-white/30"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Supprimer cette allocation ?")) {
                      onDeleteAllocation(allocation.id);
                    }
                  }}
                  className="rounded-full p-1.5 text-red-900 transition hover:bg-red-500/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-slate-900">
              {editingAllocationId ? "Modifier l'allocation" : "Nouvelle allocation"}
            </h5>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full p-1 hover:bg-white/30"
            >
              <X className="h-4 w-4 text-slate-900" />
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-900">
              Compte *
            </label>
            <select
              required
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                setError("");
              }}
              disabled={!!editingAllocationId}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:opacity-50"
            >
              <option value="">Sélectionner un compte</option>
              {availableAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - Disponible: {getAvailableBalance(account.id).toLocaleString("fr-FR")} €
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-900">
              Montant à allouer *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900"
                placeholder="1000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                €
              </span>
            </div>
            {selectedAccountId && (
              <p className="mt-1 text-xs text-slate-900/80">
                Solde disponible: {getAvailableBalance(selectedAccountId).toLocaleString("fr-FR")} €
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-900 font-medium">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-full bg-white/30 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-white/40"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
            >
              {editingAllocationId ? "Modifier" : "Allouer"}
            </button>
          </div>
        </form>
      )}

      {allocations.length === 0 && !showAddForm && (
        <p className="text-center text-xs text-slate-900/60 py-4">
          Aucune allocation pour ce projet
        </p>
      )}
    </div>
  );
}
