// API Client for frontend requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
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
  list: () => apiRequest('/api/accounts'),
  get: (id: string) => apiRequest(`/api/accounts/${id}`),
  create: (data: any) =>
    apiRequest('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/api/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/accounts/${id}`, { method: 'DELETE' }),
};

// Contributions API
export const contributionsApi = {
  list: () => apiRequest('/api/contributions'),
  create: (data: any) =>
    apiRequest('/api/contributions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/contributions/${id}`, { method: 'DELETE' }),
};

// Stats API
export const statsApi = {
  get: () => apiRequest('/api/stats'),
};

// Settings API
export const settingsApi = {
  get: () => apiRequest('/api/settings'),
  update: (data: any) =>
    apiRequest('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
