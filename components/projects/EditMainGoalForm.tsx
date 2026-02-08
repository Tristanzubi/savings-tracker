"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";

interface EditMainGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    goalAmount: number;
    targetDate: string;
  }) => void;
  goalAmount: string;
  targetDate: string;
}

export function EditMainGoalForm({ isOpen, onClose, onSubmit, goalAmount, targetDate }: EditMainGoalFormProps) {
  const [formData, setFormData] = useState({
    goalAmount: "",
    targetDate: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        goalAmount,
        targetDate,
      });
    }
  }, [isOpen, goalAmount, targetDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      goalAmount: parseFloat(formData.goalAmount),
      targetDate: formData.targetDate,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Modifier l'objectif principal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Montant cible *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
                placeholder="40000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                €
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              L'objectif total de votre épargne immobilière.
            </p>
          </div>

          {/* Target Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date cible *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 pl-10 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
              />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-orange-600"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
