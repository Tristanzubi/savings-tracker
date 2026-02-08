"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    emoji: string;
    targetAmount: number;
    targetDate?: string;
    status?: string;
  }) => void;
  onDelete?: () => void;
  project: {
    id: string;
    name: string;
    description?: string | null;
    emoji?: string;
    targetAmount: number;
    targetDate?: string | null;
    status?: string;
  } | null;
}

export function EditProjectForm({ isOpen, onClose, onSubmit, onDelete, project }: EditProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "🏠",
    targetAmount: "",
    targetDate: "",
    status: "ACTIVE",
  });

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        emoji: project.emoji || "🏠",
        targetAmount: project.targetAmount.toString(),
        targetDate: project.targetDate ? new Date(project.targetDate).toISOString().split('T')[0] : "",
        status: project.status || "ACTIVE",
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      emoji: formData.emoji || "🏠",
      targetAmount: parseFloat(formData.targetAmount),
      targetDate: formData.targetDate || undefined,
      status: formData.status,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      if (onDelete) {
        onDelete();
      }
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Modifier le projet
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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
              placeholder="Ex: Voiture, Vacances, Mariage..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
              placeholder="Décrivez votre projet..."
            />
          </div>

          {/* Emoji + Target Amount */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Icône
              </label>
              <select
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-2xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="🏠">🏠</option>
                <option value="🚗">🚗</option>
                <option value="✈️">✈️</option>
                <option value="💍">💍</option>
                <option value="🎓">🎓</option>
                <option value="💰">💰</option>
                <option value="🎯">🎯</option>
                <option value="🏖️">🏖️</option>
                <option value="🏢">🏢</option>
                <option value="🎸">🎸</option>
                <option value="💻">💻</option>
                <option value="📱">📱</option>
                <option value="🎮">🎮</option>
                <option value="🐕">🐕</option>
                <option value="🌟">🌟</option>
                <option value="💎">💎</option>
                <option value="🎨">🎨</option>
                <option value="📚">📚</option>
              </select>
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
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
                  placeholder="15000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  €
                </span>
              </div>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date cible
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-orange-500"
            >
              <option value="ACTIVE">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-red-600"
            >
              Supprimer
            </button>
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
