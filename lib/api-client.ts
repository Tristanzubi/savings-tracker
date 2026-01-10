// API Client for frontend requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UserSettings {
  id: string | null;
  goal: number;
  targetDate: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface SavingsAccount {
  id: string;
  userId: string;
  name: string;
  type: string;
  interestRate: number;
  initialBalance: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsContribution {
  id: string;
  savingsAccountId: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

async function apiRequest<T>(
  endpoint: string,
  options?: Record<string, any>
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Accounts API
export const accountsApi = {
  list: () => apiRequest<SavingsAccount[]>('/api/accounts'),
  get: (id: string) => apiRequest<SavingsAccount>(`/api/accounts/${id}`),
  create: (data: any) =>
    apiRequest<SavingsAccount>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<SavingsAccount>(`/api/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/api/accounts/${id}`, { method: 'DELETE' }),
};

// Contributions API
export const contributionsApi = {
  list: () => apiRequest<SavingsContribution[]>('/api/contributions'),
  create: (data: any) =>
    apiRequest<SavingsContribution>('/api/contributions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<SavingsContribution>(`/api/contributions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/api/contributions/${id}`, { method: 'DELETE' }),
};

// Stats API
export const statsApi = {
  get: () => apiRequest('/api/stats'),
};

// Settings API
export const settingsApi = {
  get: () => apiRequest<UserSettings>('/api/settings'),
  update: (data: any) =>
    apiRequest<UserSettings>('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
