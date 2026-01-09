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
import { useAccounts, useContributions, useSettings } from "@/lib/hooks";
import { accountsApi, contributionsApi } from "@/lib/api-client";

const accountTypeEmojis: Record<string, string> = {
  LEP: "🏦",
  PEL: "🏡",
  LIVRET_A: "💰",
  AUTRE: "📊",
};

const accountDescriptions: Record<string, string> = {
  LEP: "Livret d'épargne populaire",
  PEL: "Plan épargne logement",
  LIVRET_A: "Épargne de précaution",
  AUTRE: "Autre type de compte",
};

export default function DashboardPage() {
  const [activeRoute] = useState("dashboard");
  const [showAddContributionForm, setShowAddContributionForm] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch real data from backend
  const { accounts, isLoading: accountsLoading, refetch: refetchAccounts } = useAccounts();
  const { contributions, isLoading: contributionsLoading, refetch: refetchContributions } = useContributions();
  const { settings } = useSettings();

  // Handle adding new account
  const handleAddAccount = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await accountsApi.create({
        name: data.name,
        type: data.type,
        interestRate: data.interestRate,
        initialBalance: data.initialBalance,
      });
      setShowAddAccountForm(false);
      refetchAccounts();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Erreur lors de la création du compte");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding new contribution
  const handleAddContribution = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await contributionsApi.create({
        savingsAccountId: data.accountId,
        amount: data.amount,
        date: new Date(data.date).toISOString(),
        notes: data.note,
      });
      setShowAddContributionForm(false);
      refetchContributions();
      refetchAccounts();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Erreur lors de l'ajout du versement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals from accounts
  const totalSavings = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
  const goal = settings?.goal || 40000;
  const percentage = goal > 0 ? Math.round((totalSavings / goal) * 100) : 0;
  const remainingToSave = Math.max(0, goal - totalSavings);

  // Format contributions for display
  const formattedContributions = contributions.slice(0, 5).map((contrib) => {
    const account = accounts.find(acc => acc.id === contrib.savingsAccountId);
    return {
      id: contrib.id,
      amount: contrib.amount,
      accountName: account?.name || "Unknown",
      date: new Date(contrib.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      label: contrib.notes || "Versement",
    };
  });

  const accountsForSelect = accounts.map((acc) => ({
    id: acc.id,
    name: acc.name,
  }));

  // Show loading state if needed
  if (accountsLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
        <Header activeRoute={activeRoute} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
          <div className="text-center">Chargement des données...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header activeRoute={activeRoute} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="space-y-6">
          {/* Top: Main cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Total Savings Card */}
            <TotalSavingsCard
              currentSavings={totalSavings}
              goal={goal}
              percentage={percentage}
              deadline="31 décembre 2028"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={Check}
                iconColor="lime"
                title="Il reste à épargner"
                value={`${(remainingToSave).toLocaleString('fr-FR')} €`}
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
                  value={`${(remainingToSave / 35).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/mois`}
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
                  accountType={account.type as any}
                  balance={account.currentBalance}
                  interestRate={account.interestRate}
                  createdAt={new Date(account.createdAt).toLocaleDateString('fr-FR')}
                  emoji={accountTypeEmojis[account.type] || "💰"}
                  description={accountDescriptions[account.type] || "Compte d'épargne"}
                  onViewDetails={() =>
                    console.log("Voir détails:", account.id)
                  }
                />
              ))}
            </div>
          </div>

          {/* Recent Contributions */}
          <RecentContributionsList
            contributions={formattedContributions}
            onAdd={() => setShowAddContributionForm(true)}
            onViewAll={() => (window.location.href = "/contributions")}
          />
        </div>
      </main>

      {/* Error message */}
      {submitError && (
        <div className="fixed bottom-4 right-4 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-lg">
          {submitError}
        </div>
      )}

      {/* Modals */}
      <AddContributionForm
        isOpen={showAddContributionForm}
        onClose={() => {
          setShowAddContributionForm(false);
          setSubmitError(null);
        }}
        onSubmit={handleAddContribution}
        accounts={accountsForSelect}
      />

      <AddAccountForm
        isOpen={showAddAccountForm}
        onClose={() => {
          setShowAddAccountForm(false);
          setSubmitError(null);
        }}
        onSubmit={handleAddAccount}
      />
    </div>
  );
}
