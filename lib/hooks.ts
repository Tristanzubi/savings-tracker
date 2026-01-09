'use client';

import { useState, useEffect, useCallback } from 'react';
import { accountsApi, contributionsApi, statsApi, settingsApi, type UserSettings, type SavingsAccount, type SavingsContribution } from './api-client';

// Hook pour les comptes d'épargne
export function useAccounts() {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await accountsApi.list();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, isLoading, error, refetch: fetchAccounts };
}

// Hook pour les contributions
export function useContributions() {
  const [contributions, setContributions] = useState<SavingsContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contributionsApi.list();
      setContributions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contributions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  return { contributions, isLoading, error, refetch: fetchContributions };
}

// Hook pour les statistiques
export function useStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await statsApi.get();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

// Hook pour les paramètres utilisateur
export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.get();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, isLoading, error, refetch: fetchSettings };
}
