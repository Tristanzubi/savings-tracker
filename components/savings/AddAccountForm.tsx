"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Wallet, Calendar, ChevronDown } from "lucide-react";
import { AccountType } from "./SavingsAccountCard";

interface AddAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: AccountType;
    interestRate: number;
    initialBalance: number;
    createdAt: string;
  }) => void;
}

const accountTypes: AccountType[] = ["LEP", "PEL", "LDD", "Livret A", "Autre"];

export function AddAccountForm({
  isOpen,
  onClose,
  onSubmit,
}: AddAccountFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "LEP" as AccountType,
    interestRate: "",
    initialBalance: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      interestRate: parseFloat(formData.interestRate),
      initialBalance: parseFloat(formData.initialBalance),
      createdAt: formData.createdAt,
    });
    // Reset form
    setFormData({
      name: "",
      type: "LEP",
      interestRate: "",
      initialBalance: "",
      createdAt: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un compte d'épargne"
      description="Configurez un nouveau LEP, PEL, Livret A ou autre compte."
      icon={Wallet}
      iconColor="emerald"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Account Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="account-name"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Nom du compte
          </label>
          <input
            id="account-name"
            type="text"
            placeholder="LEP Tristan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/40"
          />
        </div>

        {/* Type & Interest Rate */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Type
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as AccountType })
                }
                required
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:ring-orange-500/40"
              >
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 stroke-[1.5] text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-rate"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Taux d'intérêt annuel
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <input
                id="account-rate"
                type="number"
                min="0"
                step="0.01"
                placeholder="2.7"
                value={formData.interestRate}
                onChange={(e) =>
                  setFormData({ ...formData, interestRate: e.target.value })
                }
                required
                className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400"
              />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Initial Balance & Created Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="account-initial"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Solde initial
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <input
                id="account-initial"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.initialBalance}
                onChange={(e) =>
                  setFormData({ ...formData, initialBalance: e.target.value })
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
              htmlFor="account-date"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Date de création
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-within:border-orange-500 dark:focus-within:ring-orange-500/40">
              <Calendar className="h-4 w-4 stroke-[1.5] text-slate-400 dark:text-slate-500" />
              <input
                id="account-date"
                type="date"
                value={formData.createdAt}
                onChange={(e) =>
                  setFormData({ ...formData, createdAt: e.target.value })
                }
                required
                className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Le solde actuel sera calculé comme initialBalance + SUM(contributions).
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-emerald-500/40 hover:bg-emerald-600"
          >
            Créer le compte
          </button>
        </div>
      </form>
    </Modal>
  );
}
