"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContributionItem } from "@/components/dashboard/ContributionItem";
import { AddContributionForm } from "@/components/dashboard/AddContributionForm";
import { Plus } from "lucide-react";

export default function ContributionsPage() {
  const [activeRoute] = useState("contributions");
  const [showAddContributionForm, setShowAddContributionForm] = useState(false);

  // Mock data - à remplacer par des vraies données de la DB
  const contributions = [
    {
      id: "1",
      amount: 500,
      accountName: "LEP Tristan",
      date: "03 janv. 2025",
      label: "Salaire décembre",
    },
    {
      id: "2",
      amount: 400,
      accountName: "PEL Commun",
      date: "28 déc. 2024",
      label: "Virement programmé",
    },
    {
      id: "3",
      amount: 300,
      accountName: "Livret A",
      date: "15 déc. 2024",
      label: "Bonus annuel",
    },
    {
      id: "4",
      amount: 500,
      accountName: "LEP Partenaire",
      date: "01 déc. 2024",
      label: "Salaire",
    },
    {
      id: "5",
      amount: 350,
      accountName: "PEL Commun",
      date: "28 nov. 2024",
      label: "Automatique",
    },
    {
      id: "6",
      amount: 600,
      accountName: "LEP Tristan",
      date: "15 nov. 2024",
      label: "Prime",
    },
    {
      id: "7",
      amount: 400,
      accountName: "Livret A",
      date: "01 nov. 2024",
      label: "Virement mensuel",
    },
    {
      id: "8",
      amount: 500,
      accountName: "LEP Partenaire",
      date: "28 oct. 2024",
      label: "Salaire",
    },
  ];

  const accounts = [
    { id: "1", name: "LEP Tristan" },
    { id: "2", name: "LEP Partenaire" },
    { id: "3", name: "PEL Commun" },
    { id: "4", name: "Livret A Sécurité" },
  ];

  const handleAddContribution = (data: any) => {
    console.log("Nouveau versement créé:", data);
    // TODO: Ajouter le versement à la base de données
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header activeRoute={activeRoute} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="space-y-6">
          <PageHeader
            title="Historique des versements"
            description="Suivez tous les versements manuels vers vos comptes d'épargne."
            action={{
              label: "Ajouter un versement",
              icon: Plus,
              onClick: () => setShowAddContributionForm(true),
            }}
          />

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total ce mois
                </p>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                  +12 % vs mois dernier
                </span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                1 200 €
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Moyenne mensuelle
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                950 €
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total depuis début
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                26 000 €
              </p>
            </div>
          </div>

          {/* Contributions List */}
          <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Tous les versements
            </h2>
            <div className="space-y-2">
              {contributions.map((contribution) => (
                <ContributionItem
                  key={contribution.id}
                  amount={contribution.amount}
                  accountName={contribution.accountName}
                  date={contribution.date}
                  label={contribution.label}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Contribution Modal */}
      <AddContributionForm
        isOpen={showAddContributionForm}
        onClose={() => setShowAddContributionForm(false)}
        onSubmit={handleAddContribution}
        accounts={accounts}
      />
    </div>
  );
}
