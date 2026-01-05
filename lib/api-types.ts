import { AccountType } from "@prisma/client";

// Account Types
export interface SavingsAccount {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  interestRate: number;
  initialBalance: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    contributions: number;
  };
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  interestRate: number;
  initialBalance: number;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  interestRate?: number;
}

// Contribution Types
export interface SavingsContribution {
  id: string;
  savingsAccountId: string;
  amount: number;
  date: Date;
  notes?: string | null;
  createdAt: Date;
  savingsAccount?: {
    id: string;
    name: string;
    type: AccountType;
  };
}

export interface CreateContributionInput {
  savingsAccountId: string;
  amount: number;
  date: string | Date;
  notes?: string;
}

// Statistics Types
export interface DashboardStats {
  totalSavings: number;
  totalContributionsThisMonth: number;
  averageMonthlyContributions: number;
  totalContributions: number;
  goalAmount: number;
  targetDate: Date | null;
  progressPercentage: number;
  monthlyTrend: number;
  recentContributions: SavingsContribution[];
  accountCount: number;
  contributionCount: number;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

// Settings Types
export interface UserSettings {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  goalAmount: number;
  targetDate: Date | null;
}

export interface UpdateSettingsInput {
  name?: string;
  email?: string;
  // Future fields when added to User schema:
  // goalAmount?: number;
  // targetDate?: string | Date;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}

export interface ApiError {
  error: string;
  details?: any;
}
