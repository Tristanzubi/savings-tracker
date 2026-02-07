"use client";

import type React from "react";
import { useState } from "react";
import { X, Target } from "lucide-react";

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    emoji?: string;
    targetAmount: number;
    targetDate?: string;
  }) => void;
}

export function AddProjectForm({ isOpen, onClose, onSubmit }: AddProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "🎯",
    targetAmount: "",
    targetDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      emoji: formData.emoji || "🎯",
      targetAmount: parseFloat(formData.targetAmount),
      targetDate: formData.targetDate || undefined,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      emoji: "🎯",
      targetAmount: "",
      targetDate: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Nouveau projet
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Créez un objectif d'épargne
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nom du projet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Achat maison, Voiture, Vacances"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
            />
          </div>

          {/* Emoji + Target Amount */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Emoji
              </label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                placeholder="🎯"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-2xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800"
                maxLength={2}
              />
            </div>

            <div className="col-span-3">
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Objectif *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  placeholder="50000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  €
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Quelques détails sur votre projet..."
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {/* Target Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date cible (optionnel)
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-orange-500 px-4 py-2 font-medium text-white shadow-md shadow-orange-500/40 hover:bg-orange-600"
            >
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
