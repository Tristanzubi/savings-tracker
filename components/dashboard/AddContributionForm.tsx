"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus, Calendar, ChevronDown } from "lucide-react";

interface AddContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    accountId: string;
    amount: number;
    date: string;
    note: string;
  }) => void;
  accounts?: Array<{ id: string; name: string }>;
}

export function AddContributionForm({
  isOpen,
  onClose,
  onSubmit,
  accounts = [],
}: AddContributionFormProps) {
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      accountId: formData.accountId,
      amount: parseFloat(formData.amount),
      date: formData.date,
      note: formData.note,
    });
    // Reset form
    setFormData({
      accountId: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un versement"
      description="Enregistre un virement manuel vers l'un de vos comptes."
      icon={Plus}
      iconColor="orange"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Account Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="contribution-account"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Compte
          </label>
          <div className="relative">
            <select
              id="contribution-account"
              value={formData.accountId}
              onChange={(e) =>
                setFormData({ ...formData, accountId: e.target.value })
              }
              required
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:ring-orange-500/40"
            >
              <option value="">Sélectionner un compte</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 stroke-[1.5] text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Liste alimentée par vos comptes d'épargne.
          </p>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="contribution-amount"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Montant
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <input
                id="contribution-amount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="500"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400"
              />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                €
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="contribution-date"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Date
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <Calendar className="h-4 w-4 stroke-[1.5] text-slate-400 dark:text-slate-500" />
              <input
                id="contribution-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label
            htmlFor="contribution-notes"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Note (optionnelle)
          </label>
          <textarea
            id="contribution-notes"
            rows={3}
            placeholder="Ex: bonus, salaire, virement exceptionnel..."
            value={formData.note}
            onChange={(e) =>
              setFormData({ ...formData, note: e.target.value })
            }
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/40"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-orange-500/40 hover:bg-orange-600"
          >
            Enregistrer le versement
          </button>
        </div>
      </form>
    </Modal>
  );
}
