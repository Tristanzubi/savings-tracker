import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const ActionIcon = action?.icon;

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        <p className="text-lg font-normal text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/40 transition hover:bg-orange-600"
        >
          {ActionIcon && <ActionIcon className="h-4 w-4 stroke-[1.5]" />}
          {action.label}
        </button>
      )}
    </header>
  );
}
