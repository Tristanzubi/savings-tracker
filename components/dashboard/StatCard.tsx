import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: "lime" | "amber" | "orange";
  title: string;
  value: string;
  description: string;
  badge?: string;
  size?: "small" | "large";
}

const iconColorClasses = {
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

const badgeColorClasses = {
  lime: "bg-lime-500/10 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300",
  amber: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  orange: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

export function StatCard({
  icon: Icon,
  iconColor,
  title,
  value,
  description,
  badge,
  size = "small",
}: StatCardProps) {
  const isLarge = size === "large";

  return (
    <div
      className={`flex flex-col ${
        isLarge ? "gap-3 p-5" : "gap-2 p-4"
      } rounded-3xl bg-white shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex ${
              isLarge ? "h-9 w-9" : "h-8 w-8"
            } items-center justify-center rounded-2xl ${iconColorClasses[iconColor]}`}
          >
            <Icon className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p
            className={`${
              isLarge ? "text-sm" : "text-xs uppercase tracking-wide"
            } font-medium ${isLarge ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
          >
            {title}
          </p>
        </div>
        {badge && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeColorClasses[iconColor]}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className={`${
          isLarge ? "text-2xl" : "text-xl"
        } font-semibold tracking-tight text-slate-900 dark:text-slate-50`}
      >
        {value}
      </p>

      {/* Description */}
      <p
        className={`${
          isLarge ? "text-base" : "text-xs"
        } font-normal text-slate-500 dark:text-slate-400`}
      >
        {description}
      </p>
    </div>
  );
}
