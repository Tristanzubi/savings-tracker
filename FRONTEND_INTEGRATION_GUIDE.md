# Frontend Integration Guide

This guide helps you integrate the backend API with your Next.js frontend components.

## Quick Start

### 1. Import Types
```typescript
import {
  SavingsAccount,
  CreateAccountInput,
  SavingsContribution,
  CreateContributionInput,
  DashboardStats,
  UserSettings,
} from "@/lib/api-types";
```

### 2. Example API Calls

#### Fetch All Accounts
```typescript
async function fetchAccounts() {
  try {
    const response = await fetch('/api/accounts');
    if (!response.ok) throw new Error('Failed to fetch accounts');
    const accounts: SavingsAccount[] = await response.json();
    return accounts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### Create a New Account
```typescript
async function createAccount(data: CreateAccountInput) {
  try {
    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const account: SavingsAccount = await response.json();
    return account;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage:
const newAccount = await createAccount({
  name: "Mon Livret A",
  type: "LIVRET_A",
  interestRate: 3.0,
  initialBalance: 1000,
});
```

#### Add a Contribution
```typescript
async function createContribution(data: CreateContributionInput) {
  try {
    const response = await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const contribution: SavingsContribution = await response.json();
    return contribution;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage:
const newContribution = await createContribution({
  savingsAccountId: "clxxx...",
  amount: 100,
  date: new Date().toISOString(),
  notes: "Monthly savings",
});
```

#### Fetch Dashboard Statistics
```typescript
async function fetchStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    const stats: DashboardStats = await response.json();
    return stats;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### 3. React Component Example

```typescript
'use client';

import { useEffect, useState } from 'react';
import { SavingsAccount, CreateAccountInput } from '@/lib/api-types';
import { AccountType } from '@prisma/client';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (formData: CreateAccountInput) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const newAccount = await response.json();
      setAccounts([newAccount, ...accounts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setAccounts(accounts.filter(a => a.id !== accountId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Savings Accounts</h1>
      <div className="accounts-grid">
        {accounts.map(account => (
          <div key={account.id} className="account-card">
            <h2>{account.name}</h2>
            <p>Type: {account.type}</p>
            <p>Current Balance: {account.currentBalance.toFixed(2)} €</p>
            <p>Interest Rate: {account.interestRate}%</p>
            <p>Contributions: {account._count?.contributions || 0}</p>
            <button onClick={() => handleDeleteAccount(account.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Using with React Query (Recommended)

Install React Query:
```bash
npm install @tanstack/react-query
```

Create API hooks:
```typescript
// lib/api-hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SavingsAccount, CreateAccountInput, DashboardStats } from './api-types';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return response.json() as Promise<SavingsAccount[]>;
    },
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAccountInput) => {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return response.json() as Promise<SavingsAccount>;
    },
    onSuccess: () => {
      // Invalidate and refetch accounts after creating a new one
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json() as Promise<DashboardStats>;
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
```

Use in components:
```typescript
'use client';

import { useAccounts, useCreateAccount, useDeleteAccount } from '@/lib/api-hooks';

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  const handleCreate = (data: CreateAccountInput) => {
    createAccount.mutate(data);
  };

  const handleDelete = (accountId: string) => {
    if (confirm('Are you sure?')) {
      deleteAccount.mutate(accountId);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Your UI here */}
    </div>
  );
}
```

### 5. Error Handling Best Practices

```typescript
async function apiCall() {
  try {
    const response = await fetch('/api/accounts');

    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    // Handle forbidden errors
    if (response.status === 403) {
      throw new Error('You do not have permission to access this resource');
    }

    // Handle not found errors
    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    // Handle validation errors
    if (response.status === 400) {
      const error = await response.json();
      console.error('Validation errors:', error.details);
      throw new Error(error.error);
    }

    // Handle success
    if (!response.ok) {
      throw new Error('An unexpected error occurred');
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### 6. Common Patterns

#### Format Currency
```typescript
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
```

#### Format Date
```typescript
function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
```

#### Account Type Labels
```typescript
import { AccountType } from '@prisma/client';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  LEP: 'Livret d\'Épargne Populaire',
  PEL: 'Plan d\'Épargne Logement',
  LIVRET_A: 'Livret A',
  AUTRE: 'Autre',
};

function getAccountTypeLabel(type: AccountType): string {
  return ACCOUNT_TYPE_LABELS[type];
}
```

## Next Steps

1. Replace hardcoded data in your components with API calls
2. Add proper loading states and error handling
3. Implement optimistic updates for better UX
4. Add form validation that matches backend validation
5. Consider implementing React Query for better state management
6. Add toast notifications for success/error messages

## Important Notes

- All API routes require authentication
- Dates should be in ISO 8601 format
- The API uses Prisma transactions for critical operations
- Account balances are automatically updated when contributions are added/deleted
- See `API_DOCUMENTATION.md` for complete API reference
