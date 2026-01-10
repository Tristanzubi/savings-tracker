"use client";

import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

interface AccountDetailsModalProps {
  isOpen: boolean;
  accountName: string;
  accountType: string;
  currentBalance: number;
  interestRate: number;
  initialBalance: number;
  onClose: () => void;
  onSave: (data: { currentBalance: number; interestRate: number }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function AccountDetailsModal({
  isOpen,
  accountName,
  accountType,
  currentBalance,
  interestRate,
  initialBalance,
  onClose,
  onSave,
  onDelete,
}: AccountDetailsModalProps) {
  const [editBalance, setEditBalance] = useState(currentBalance.toString());
  const [editRate, setEditRate] = useState(interestRate.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        currentBalance: parseFloat(editBalance),
        interestRate: parseFloat(editRate),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer le compte "${accountName}" ? Cette action est irréversible.`
      )
    ) {
      setIsDeleting(true);
      setError(null);
      try {
        await onDelete();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-screen w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Détails du compte
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Account Info */}
        <div className="mb-6 space-y-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Nom du compte
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {accountName}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Type de compte
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {accountType}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Solde initial
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {initialBalance.toLocaleString("fr-FR")} €
            </p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="mb-6 space-y-4">
          {/* Current Balance */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Solde actuel
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <input
                type="number"
                inputMode="decimal"
                value={editBalance}
                onChange={(e) => setEditBalance(e.target.value)}
                className="w-full border-none bg-transparent text-lg outline-none placeholder:text-slate-400 dark:text-slate-50"
                placeholder="0"
                disabled={isSaving || isDeleting}
              />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                €
              </span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Taux d'intérêt
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <input
                type="number"
                inputMode="decimal"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                className="w-full border-none bg-transparent text-lg outline-none placeholder:text-slate-400 dark:text-slate-50"
                placeholder="0"
                disabled={isSaving || isDeleting}
                step="0.01"
              />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-slate-900/40 transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving || isDeleting}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
            >
              Annuler
            </button>
          </div>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
            className="flex items-center justify-center gap-2 rounded-full bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-500/20 disabled:opacity-50 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Suppression..." : "Supprimer le compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
