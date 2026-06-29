import { Request, RequestHandler } from 'express';
import {
  User, Account, Card, Transaction, Loan,
  FixedDeposit, InsurancePolicy, Document,
  Application, Notification, AuditLog,
} from '@prisma/client';

// ─── Authenticated Request ────────────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;  // Guaranteed after authenticate() middleware
  deviceId?: string;
  sessionId?: string;
}

// Handler type alias for Express routes — use this in route files to avoid TS overload errors
export type Handler = (req: any, res: any, next: any) => any;

// ─── JWT ──────────────────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ValidationError[];
  requestId?: string;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Service Result ───────────────────────────────────────────────────────────
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number };

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface LoginResult {
  user: SafeUser;
  tokens: TokenPair;
  sessionId: string;
}

export interface SafeUser {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  kycStatus: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

// ─── Transaction Types ────────────────────────────────────────────────────────
export interface InitiateTransactionDto {
  accountId: string;
  beneficiaryId?: string;
  amount: number;
  mode: string;
  description?: string;
  remarks?: string;
  senderUpi?: string;
  receiverUpi?: string;
  cardId?: string;
  mpin?: string;
}

export interface TransactionWithRelations extends Transaction {
  account?: Partial<Account>;
  merchant?: { name: string; logoUrl: string | null } | null;
  receipt?: { id: string } | null;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────
export interface DashboardSummary {
  totalBalance: number;
  availableBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  rewardPoints: number;
  creditScore: number;
  upcomingBills: UpcomingBill[];
  recentTransactions: TransactionWithRelations[];
  savingsGoalProgress: number;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  status: string;
  daysUntilDue: number;
}

// ─── Search Types ─────────────────────────────────────────────────────────────
export interface SearchResult {
  id: string;
  featureKey: string;
  title: string;
  description: string | null;
  category: string;
  module: string;
  route: string;
  icon: string | null;
  estimatedTime: string | null;
  shortcut: string | null;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
  suggestions: string[];
  didYouMean?: string;
}

// ─── Vault Types ──────────────────────────────────────────────────────────────
export interface VaultFolderTree {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
  documentCount: number;
  children: VaultFolderTree[];
}

export interface DocumentUploadResult {
  document: Document;
  fileKey: string;
  fileUrl: string;
}

// ─── Application Draft Types ──────────────────────────────────────────────────
export interface ApplicationStepDefinition {
  index: number;
  name: string;
  title: string;
  fields: string[];
  isOptional: boolean;
}

export interface SaveDraftDto {
  applicationId: string;
  stepIndex: number;
  fieldData: Record<string, unknown>;
}

// ─── Notification Types ───────────────────────────────────────────────────────
export interface SendNotificationDto {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channel?: string;
  actionUrl?: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────
export interface FeatureUsageStats {
  featureKey: string;
  label: string;
  usageCount: number;
  lastUsedAt: Date | null;
}

export interface SpendingAnalytics {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  byCategory: { category: string; amount: number; percentage: number }[];
}

// ─── File Storage Types ───────────────────────────────────────────────────────
export interface StoredFile {
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  fileUrl: string;
  checksum: string;
}

export interface UploadOptions {
  userId: string;
  category: string;
  originalName: string;
  buffer: Buffer;
  mimeType: string;
}
