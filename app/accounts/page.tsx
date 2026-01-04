"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SavingsAccountCard } from "@/components/savings/SavingsAccountCard";
import { AddAccountForm } from "@/components/savings/AddAccountForm";
import { Plus } from "lucide-react";

export default function AccountsPage() {
  const [activeRoute] = useState("accounts");
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  // Mock data - à remplacer par des vraies données de la DB
  const accounts = [
    {
      id: "1",
      name: "LEP Tristan",
      type: "LEP" as const,
      balance: 7500,
      interestRate: 2.7,
      createdAt: "03/01/2022",
      emoji: "🏦",
      description: "Livret d'épargne populaire",
    },
    {
      id: "2",
      name: "LEP Partenaire",
      type: "LEP" as const,
      balance: 8000,
      interestRate: 2.7,
      createdAt: "15/02/2022",
      emoji: "🏦",
      description: "Livret d'épargne populaire",
    },
    {
      id: "3",
      name: "PEL Commun",
      type: "PEL" as const,
      balance: 7000,
      interestRate: 1.5,
      createdAt: "10/03/2023",
      emoji: "🏡",
      description: "Plan épargne logement",
    },
    {
      id: "4",
      name: "Livret A Sécurité",
      type: "Livret A" as const,
      balance: 3500,
      interestRate: 3.0,
      createdAt: "05/05/2021",
      emoji: "💰",
      description: "Épargne de précaution",
    },
  ];

  const handleAddAccount = (data: any) => {
    console.log("Nouveau compte créé:", data);
    // TODO: Ajouter le compte à la base de données
  };

  const handleViewDetails = (accountId: string) => {
    console.log("Voir détails du compte:", accountId);
    // TODO: Navigation vers la page de détails
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header activeRoute={activeRoute} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="space-y-6">
          <PageHeader
            title="Comptes d'épargne"
            description="Gérez tous vos LEP, PEL et livrets utilisés pour l'apport immobilier."
            action={{
              label: "Ajouter un compte",
              icon: Plus,
              onClick: () => setShowAddAccountForm(true),
            }}
          />

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {accounts.map((account) => (
              <SavingsAccountCard
                key={account.id}
                accountName={account.name}
                accountType={account.type}
                balance={account.balance}
                interestRate={account.interestRate}
                createdAt={account.createdAt}
                emoji={account.emoji}
                description={account.description}
                onViewDetails={() => handleViewDetails(account.id)}
              />
            ))}
          </div>

          {/* Add Account Button (alternative placement) */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowAddAccountForm(true)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-slate-300 bg-transparent px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-orange-500 hover:text-orange-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-orange-500 dark:hover:text-orange-400"
            >
              <Plus className="h-4 w-4" />
              Ajouter un compte d'épargne
            </button>
          </div>
        </div>
      </main>

      {/* Add Account Modal */}
      <AddAccountForm
        isOpen={showAddAccountForm}
        onClose={() => setShowAddAccountForm(false)}
        onSubmit={handleAddAccount}
      />
    </div>
  );
}
