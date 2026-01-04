"use client";

import { useState } from "react";
import { TotalSavingsCard } from "@/components/dashboard/TotalSavingsCard";
import { Header } from "@/components/layout/Header";
import { SavingsAccountCard } from "@/components/savings/SavingsAccountCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentContributionsList } from "@/components/dashboard/RecentContributionsList";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddContributionForm } from "@/components/dashboard/AddContributionForm";
import { AddAccountForm } from "@/components/savings/AddAccountForm";
import { Check, Calendar, Wallet, Plus } from "lucide-react";

export default function TestPage() {
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header
        activeRoute={activeRoute}
        onNavigate={(route) => {
          setActiveRoute(route);
          console.log("Navigation vers:", route);
        }}
        onLogout={() => console.log("Déconnexion")}
      />

      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Test des composants
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Page de test pour valider le design des composants extraits du prototype.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Header
            </h2>
            <div className="space-y-2 rounded-2xl bg-white p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Le header est affiché en haut de page. Testez:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>Navigation entre les pages (Desktop + Mobile)</li>
                <li>Toggle dark/light mode</li>
                <li>Menu mobile (cliquez sur l'icône hamburger sur mobile)</li>
                <li>État actif: <strong className="text-orange-600">{activeRoute}</strong></li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              TotalSavingsCard
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TotalSavingsCard
                currentSavings={26000}
                goal={40000}
                percentage={65}
                deadline="31 décembre 2028"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              SavingsAccountCard
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SavingsAccountCard
                accountName="LEP Tristan"
                accountType="LEP"
                balance={7500}
                interestRate={2.7}
                createdAt="03/01/2022"
                emoji="🏦"
                description="Livret d'épargne populaire"
                onViewDetails={() => console.log("Voir détails LEP Tristan")}
              />
              <SavingsAccountCard
                accountName="LEP Partenaire"
                accountType="LEP"
                balance={8000}
                interestRate={2.7}
                createdAt="15/02/2022"
                emoji="🏦"
                description="Livret d'épargne populaire"
                onViewDetails={() => console.log("Voir détails LEP Partenaire")}
              />
              <SavingsAccountCard
                accountName="PEL Commun"
                accountType="PEL"
                balance={7000}
                interestRate={1.5}
                createdAt="10/03/2023"
                emoji="🏡"
                description="Plan épargne logement"
                onViewDetails={() => console.log("Voir détails PEL Commun")}
              />
              <SavingsAccountCard
                accountName="Livret A Sécurité"
                accountType="Livret A"
                balance={3500}
                interestRate={3.0}
                createdAt="05/05/2021"
                emoji="💰"
                description="Épargne de précaution"
                onViewDetails={() => console.log("Voir détails Livret A")}
              />
            </div>

            {/* Add Account Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAccountForm(true)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-slate-300 bg-transparent px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-orange-500 hover:text-orange-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-orange-500 dark:hover:text-orange-400"
              >
                <Plus className="h-4 w-4" />
                Ajouter un compte d'épargne
              </button>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              StatCard
            </h2>
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

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              RecentContributionsList
            </h2>
            <RecentContributionsList
              contributions={[
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
              ]}
              onAdd={() => console.log("Ajouter un versement")}
              onViewAll={() => console.log("Voir tout l'historique")}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              PageHeader
            </h2>
            <PageHeader
              title="Comptes d'épargne"
              description="Gérez tous vos LEP, PEL et livrets utilisés pour l'apport immobilier."
              action={{
                label: "Ajouter un compte",
                icon: Plus,
                onClick: () => console.log("Ajouter un compte"),
              }}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Formulaires (Modals)
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowContributionForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/40 transition hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Ouvrir formulaire versement
              </button>
              <button
                onClick={() => setShowAccountForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4" />
                Ouvrir formulaire compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaires modals */}
      <AddContributionForm
        isOpen={showContributionForm}
        onClose={() => setShowContributionForm(false)}
        onSubmit={(data) => {
          console.log("Nouveau versement:", data);
        }}
        accounts={[
          { id: "1", name: "LEP Tristan" },
          { id: "2", name: "PEL Couple" },
          { id: "3", name: "Livret A" },
        ]}
      />

      <AddAccountForm
        isOpen={showAccountForm}
        onClose={() => setShowAccountForm(false)}
        onSubmit={(data) => {
          console.log("Nouveau compte:", data);
        }}
      />
    </div>
  );
}
