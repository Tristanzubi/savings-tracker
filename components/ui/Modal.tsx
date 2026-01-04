"use client";

import React, { useEffect } from "react";
import { X, LucideIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: "orange" | "emerald" | "lime";
  children: React.ReactNode;
}

const iconColorClasses = {
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  iconColor = "orange",
  children,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/50 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl ${iconColorClasses[iconColor]}`}
              >
                <Icon className="h-4 w-4 stroke-[1.5]" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {title}
              </h2>
              {description && (
                <p className="text-base font-normal text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            aria-label="Fermer"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
