"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SavingsAccountCard } from "@/components/savings/SavingsAccountCard";
import { AddAccountForm } from "@/components/savings/AddAccountForm";
import { Plus } from "lucide-react";
import { useAccounts } from "@/lib/hooks";
import { accountsApi } from "@/lib/api-client";

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

export default function AccountsPage() {
  const [activeRoute] = useState("accounts");
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { accounts, isLoading, refetch: refetchAccounts } = useAccounts();

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

  const handleViewDetails = (accountId: string) => {
    console.log("Voir détails du compte:", accountId);
    // TODO: Navigation vers la page de détails
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
        <Header activeRoute={activeRoute} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
          <div className="text-center">Chargement des comptes...</div>
        </main>
      </div>
    );
  }

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
                balance={account.currentBalance}
                interestRate={account.interestRate}
                createdAt={new Date(account.createdAt).toLocaleDateString('fr-FR')}
                emoji={accountTypeEmojis[account.type] || "💰"}
                description={accountDescriptions[account.type] || "Compte d'épargne"}
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

      {/* Error message */}
      {submitError && (
        <div className="fixed bottom-4 right-4 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-lg">
          {submitError}
        </div>
      )}

      {/* Add Account Modal */}
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
