"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TotalSavingsCard } from "@/components/dashboard/TotalSavingsCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentContributionsList } from "@/components/dashboard/RecentContributionsList";
import { SavingsAccountCard } from "@/components/savings/SavingsAccountCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddContributionForm } from "@/components/dashboard/AddContributionForm";
import { AddAccountForm } from "@/components/savings/AddAccountForm";
import { Check, Calendar, Wallet, Plus } from "lucide-react";

export default function DashboardPage() {
  const [activeRoute] = useState("dashboard");
  const [showAddContributionForm, setShowAddContributionForm] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  // Mock data
  const recentContributions = [
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
  ];

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

  const accountsForSelect = accounts.map((acc) => ({
    id: acc.id,
    name: acc.name,
  }));

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header activeRoute={activeRoute} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="space-y-6">
          {/* Top: Main cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Total Savings Card */}
            <TotalSavingsCard
              currentSavings={26000}
              goal={40000}
              percentage={65}
              deadline="31 décembre 2028"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={Check}
                iconColor="lime"
                title="Il reste à épargner"
                value="14 000 €"
                description="Sur la base de tous les comptes d'épargne liés."
                badge="Calcul auto"
                size="large"
              />
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={Calendar}
                  iconColor="amber"
                  title="Mois restants"
                  value="35"
                  description="Jusqu'au 31 décembre 2028."
                />
                <StatCard
                  icon={Wallet}
                  iconColor="orange"
                  title="Mensuel requis"
                  value="400 €/mois"
                  description="Pour atteindre l'objectif à temps."
                />
              </div>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="space-y-4">
            <PageHeader
              title="Vos comptes d'épargne"
              description="Vue consolidée de vos LEP, PEL et livrets."
              action={{
                label: "Voir tous les comptes",
                onClick: () => (window.location.href = "/accounts"),
              }}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {accounts.slice(0, 2).map((account) => (
                <SavingsAccountCard
                  key={account.id}
                  accountName={account.name}
                  accountType={account.type}
                  balance={account.balance}
                  interestRate={account.interestRate}
                  createdAt={account.createdAt}
                  emoji={account.emoji}
                  description={account.description}
                  onViewDetails={() =>
                    console.log("Voir détails:", account.id)
                  }
                />
              ))}
            </div>
          </div>

          {/* Recent Contributions */}
          <RecentContributionsList
            contributions={recentContributions}
            onAdd={() => setShowAddContributionForm(true)}
            onViewAll={() => (window.location.href = "/contributions")}
          />
        </div>
      </main>

      {/* Modals */}
      <AddContributionForm
        isOpen={showAddContributionForm}
        onClose={() => setShowAddContributionForm(false)}
        onSubmit={(data) => console.log("Nouveau versement:", data)}
        accounts={accountsForSelect}
      />

      <AddAccountForm
        isOpen={showAddAccountForm}
        onClose={() => setShowAddAccountForm(false)}
        onSubmit={(data) => console.log("Nouveau compte:", data)}
      />
    </div>
  );
}
