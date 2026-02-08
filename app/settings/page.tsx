"use client";

import type React from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Header } from "@/components/layout/Header";
import {
  User,
  Sun,
  Moon,
  Trash2,
  ChevronDown,
  Plus,
  Target,
} from "lucide-react";
import { useProjects, useAccounts } from "@/lib/hooks";
import { projectsApi, type Project } from "@/lib/api-client";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddProjectForm } from "@/components/projects/AddProjectForm";
import { EditProjectForm } from "@/components/projects/EditProjectForm";
import { ManageAllocationsModal } from "@/components/projects/ManageAllocationsModal";

export default function SettingsPage() {
  const [activeRoute] = useState("settings");
  const { theme, setTheme } = useTheme();

  const [userName, setUserName] = useState("Tristan");

  // Projects
  const { projects, refetch: refetchProjects } = useProjects();
  const { accounts, refetch: refetchAccounts } = useAccounts();
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [showManageAllocationsModal, setShowManageAllocationsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const handleUpdateProfile = async () => {
    console.log("Modifier le profil:", { userName });
    // TODO: Mettre à jour le profil via API
  };

  const handleDeleteAccount = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      console.log("Supprimer le compte");
      // TODO: Supprimer le compte
    }
  };

  const handleResetData = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.")) {
      console.log("Réinitialiser les données");
      // TODO: Réinitialiser les données
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Project handlers
  const handleAddProject = async (data: any) => {
    try {
      await projectsApi.create({
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate ? new Date(data.targetDate).toISOString() : undefined,
      });
      setShowAddProjectForm(false);
      refetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const handleEditProject = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowEditProjectForm(true);
    }
  };

  const handleUpdateProject = async (data: any) => {
    if (!selectedProject) return;

    try {
      await projectsApi.update(selectedProject.id, {
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate ? new Date(data.targetDate).toISOString() : null,
        status: data.status,
      });
      setShowEditProjectForm(false);
      setSelectedProject(null);
      refetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectsApi.delete(projectId);
      refetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleDeleteSelectedProject = async () => {
    if (!selectedProject) return;
    await handleDeleteProject(selectedProject.id);
    setShowEditProjectForm(false);
    setSelectedProject(null);
  };

  const handleManageAllocations = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowManageAllocationsModal(true);
    }
  };

  const handleAddAllocation = async (accountId: string, amount: number) => {
    if (!selectedProject) return;

    try {
      await fetch(`/api/projects/${selectedProject.id}/allocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savingsAccountId: accountId, allocatedAmount: amount }),
      });
      await refetchProjects();
      await refetchAccounts();
    } catch (error) {
      console.error('Error adding allocation:', error);
      throw error;
    }
  };

  const handleUpdateAllocation = async (allocationId: string, amount: number) => {
    if (!selectedProject) return;

    try {
      await fetch(`/api/projects/${selectedProject.id}/allocations/${allocationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocatedAmount: amount }),
      });
      await refetchProjects();
      await refetchAccounts();
    } catch (error) {
      console.error('Error updating allocation:', error);
      throw error;
    }
  };

  const handleDeleteAllocation = async (allocationId: string) => {
    if (!selectedProject) return;

    try {
      await fetch(`/api/projects/${selectedProject.id}/allocations/${allocationId}`, {
        method: 'DELETE',
      });
      await refetchProjects();
      await refetchAccounts();
    } catch (error) {
      console.error('Error deleting allocation:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-slate-800">
      <Header activeRoute={activeRoute} onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        <div className="space-y-6">
          {/* Page Header */}
          <header className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Paramètres
            </h2>
            <p className="text-lg font-normal text-slate-600 dark:text-slate-300">
              Ajustez l'objectif, le profil et les préférences d'affichage.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Project Configuration */}
            <div className="col-span-1 space-y-6 lg:col-span-2">
              {/* Projects Management Section */}
              <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                      <Target className="h-4 w-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        Gestion des projets
                      </h3>
                      <p className="text-base font-normal text-slate-500 dark:text-slate-400">
                        Créez et gérez vos objectifs d'épargne
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddProjectForm(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-orange-500/40 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Nouveau projet
                  </button>
                </div>

                {projects.length > 0 ? (
                  <div className="mt-2 space-y-4">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        projectName={project.name}
                        emoji={project.emoji}
                        currentAmount={project.currentAmount || 0}
                        targetAmount={project.targetAmount}
                        progress={project.progress || 0}
                        targetDate={project.targetDate}
                        allocatedFromAccounts={project.allocatedFromAccounts || []}
                        status={project.status}
                        isExpanded={expandedProjects.includes(project.id)}
                        onToggleExpand={() => toggleProjectExpand(project.id)}
                        onEdit={() => handleEditProject(project.id)}
                        onDelete={() => handleDeleteProject(project.id)}
                        onManageAllocations={() => handleManageAllocations(project.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 dark:border-slate-700">
                    <div className="mb-3 text-5xl">🎯</div>
                    <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-50">
                      Aucun projet
                    </h4>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                      Créez votre premier projet d'épargne pour commencer
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* User Profile */}
              <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-700">
                    <User className="h-4 w-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Profil utilisateur
                    </h3>
                    <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      Synchronisé avec Better Auth.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Nom
                    </p>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:ring-orange-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Email (lecture seule)
                    </p>
                    <p className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                      tristan@example.com
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md shadow-slate-900/40 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Modifier le profil
                  </button>
                </div>
              </section>

              {/* Preferences */}
              <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Préférences
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        Mode sombre
                      </p>
                      <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        Utilise la bascule globale de l'application.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-900/5 px-1 text-slate-600 shadow-inner dark:bg-slate-700/80 dark:text-slate-200"
                    >
                      <span className="pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-700 shadow-md shadow-slate-900/20 transition-transform dark:translate-x-6 dark:bg-slate-900 dark:text-amber-300">
                        <Sun className="h-3.5 w-3.5 stroke-[1.5] dark:hidden" />
                        <Moon className="hidden h-3.5 w-3.5 stroke-[1.5] dark:block" />
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Langue
                    </label>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      Français
                      <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="flex flex-col gap-3 rounded-3xl bg-rose-50/80 p-5 shadow-lg shadow-rose-200/60 ring-1 ring-rose-200/80 dark:bg-rose-950/40 dark:ring-rose-900">
                <h3 className="text-lg font-semibold tracking-tight text-rose-700 dark:text-rose-200">
                  Zone de danger
                </h3>
                <p className="text-sm font-normal text-rose-700/80 dark:text-rose-200/80">
                  Actions irréversibles liées à votre compte et à vos données.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-rose-600/40 hover:bg-rose-700"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    Supprimer mon compte
                  </button>
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-500/20 dark:bg-rose-500/15 dark:text-rose-200 dark:hover:bg-rose-500/30"
                  >
                    Réinitialiser toutes les données
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Add Project Form Modal */}
      <AddProjectForm
        isOpen={showAddProjectForm}
        onClose={() => setShowAddProjectForm(false)}
        onSubmit={handleAddProject}
      />

      {/* Edit Project Form Modal */}
      <EditProjectForm
        isOpen={showEditProjectForm}
        onClose={() => {
          setShowEditProjectForm(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdateProject}
        onDelete={handleDeleteSelectedProject}
        project={selectedProject}
      />

      {/* Manage Allocations Modal */}
      {selectedProject && (
        <ManageAllocationsModal
          isOpen={showManageAllocationsModal}
          onClose={() => {
            setShowManageAllocationsModal(false);
            setSelectedProject(null);
          }}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          projectEmoji={selectedProject.emoji}
          allocations={selectedProject.allocations?.map(alloc => ({
            id: alloc.id,
            accountId: alloc.savingsAccount.id,
            accountName: alloc.savingsAccount.name,
            allocatedAmount: alloc.allocatedAmount,
          })) || []}
          accounts={accounts}
          onAddAllocation={handleAddAllocation}
          onUpdateAllocation={handleUpdateAllocation}
          onDeleteAllocation={handleDeleteAllocation}
        />
      )}
    </div>
  );
}
