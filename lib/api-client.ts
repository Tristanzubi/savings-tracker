// API Client for frontend requests
// Use relative URLs so it works on any domain (local or production)
const API_BASE_URL = '';

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
  allocations?: Array<{
    id: string;
    allocatedAmount: number;
    projectId: string;
  }>;
}

export interface SavingsContribution {
  id: string;
  savingsAccountId: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  emoji?: string;
  targetAmount: number;
  targetDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  currentAmount?: number;
  progress?: number;
  allocatedFromAccounts?: Array<{
    accountId: string;
    accountName: string;
    amount: number;
  }>;
  allocations?: Array<{
    id: string;
    allocatedAmount: number;
    savingsAccount: {
      id: string;
      name: string;
      currentBalance: number;
    };
  }>;
}

export interface ProjectAllocation {
  id: string;
  projectId: string;
  savingsAccountId: string;
  allocatedAmount: number;
  createdAt: string;
  updatedAt: string;
  savingsAccount?: {
    id: string;
    name: string;
    currentBalance: number;
  };
  project?: {
    id: string;
    name: string;
    emoji?: string;
  };
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

// Projects API
export const projectsApi = {
  list: () => apiRequest<Project[]>('/api/projects'),
  get: (id: string) => apiRequest<Project>(`/api/projects/${id}`),
  create: (data: any) =>
    apiRequest<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/api/projects/${id}`, { method: 'DELETE' }),

  // Allocations
  listAllocations: (projectId: string) =>
    apiRequest<ProjectAllocation[]>(`/api/projects/${projectId}/allocations`),
  createAllocation: (projectId: string, data: any) =>
    apiRequest<ProjectAllocation>(`/api/projects/${projectId}/allocations`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAllocation: (projectId: string, allocationId: string, data: any) =>
    apiRequest<ProjectAllocation>(
      `/api/projects/${projectId}/allocations/${allocationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    ),
  deleteAllocation: (projectId: string, allocationId: string) =>
    apiRequest<void>(`/api/projects/${projectId}/allocations/${allocationId}`, {
      method: 'DELETE',
    }),
};
