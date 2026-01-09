"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContributionItem } from "@/components/dashboard/ContributionItem";
import { AddContributionForm } from "@/components/dashboard/AddContributionForm";
import { Plus } from "lucide-react";
import { useContributions, useAccounts } from "@/lib/hooks";
import { contributionsApi } from "@/lib/api-client";

export default function ContributionsPage() {
  const [activeRoute] = useState("contributions");
  const [showAddContributionForm, setShowAddContributionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { contributions, isLoading: contributionsLoading, refetch: refetchContributions } = useContributions();
  const { accounts, isLoading: accountsLoading } = useAccounts();

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
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Erreur lors de l'ajout du versement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats from contributions
  const stats = useMemo(() => {
    if (!contributions || contributions.length === 0) {
      return { thisMonth: 0, average: 0, total: 0 };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthContributions = contributions.filter((c) => {
      const date = new Date(c.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const total = contributions.reduce((sum, c) => sum + c.amount, 0);
    const thisMonth = thisMonthContributions.reduce((sum, c) => sum + c.amount, 0);
    const average = contributions.length > 0 ? Math.round(total / contributions.length) : 0;

    return { thisMonth, average, total };
  }, [contributions]);

  // Format contributions for display
  const formattedContributions = contributions.map((contrib) => {
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

  if (contributionsLoading || accountsLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
        <Header activeRoute={activeRoute} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
          <div className="text-center">Chargement des versements...</div>
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
              </div>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {stats.thisMonth.toLocaleString('fr-FR')} €
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Moyenne par versement
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {stats.average.toLocaleString('fr-FR')} €
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total depuis début
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {stats.total.toLocaleString('fr-FR')} €
              </p>
            </div>
          </div>

          {/* Contributions List */}
          <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Tous les versements
            </h2>
            <div className="space-y-2">
              {formattedContributions.length > 0 ? (
                formattedContributions.map((contribution) => (
                  <ContributionItem
                    key={contribution.id}
                    amount={contribution.amount}
                    accountName={contribution.accountName}
                    date={contribution.date}
                    label={contribution.label}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Aucun versement enregistré.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Error message */}
      {submitError && (
        <div className="fixed bottom-4 right-4 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-lg">
          {submitError}
        </div>
      )}

      {/* Add Contribution Modal */}
      <AddContributionForm
        isOpen={showAddContributionForm}
        onClose={() => {
          setShowAddContributionForm(false);
          setSubmitError(null);
        }}
        onSubmit={handleAddContribution}
        accounts={accountsForSelect}
      />
    </div>
  );
}
