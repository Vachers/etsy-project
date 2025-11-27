// ========================================
// PROJEKTİF PRO - Type Definitions
// ========================================

// Color System Types
export type ColorVariant = 
  | "primary" 
  | "secondary" 
  | "accent" 
  | "success" 
  | "warning" 
  | "error" 
  | "info";

export type ColorShade = 
  | "50" 
  | "100" 
  | "200" 
  | "300" 
  | "400" 
  | "500" 
  | "600" 
  | "700" 
  | "800" 
  | "900";

// Financial Types
export type FinancialType = "revenue" | "expense" | "profit" | "pending";

// Status Types
export type StatusType = 
  | "active" 
  | "inactive" 
  | "draft" 
  | "completed" 
  | "cancelled" 
  | "pending";

// Priority Types
export type PriorityType = "low" | "medium" | "high" | "critical";

// Platform Types (for sales tracking)
export type PlatformType = 
  | "etsy" 
  | "amazon" 
  | "shopify" 
  | "ebay" 
  | "website" 
  | "other";

// Size Types
export type SizeType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: "admin" | "user" | "viewer";
  createdAt: Date;
  updatedAt: Date;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  priority: PriorityType;
  category?: Category;
  categoryId?: string;
  budget?: number;
  spent?: number;
  startDate?: Date;
  endDate?: Date;
  progress: number;
  tasks?: Task[];
  sales?: Sale[];
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  projects?: Project[];
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  priority: PriorityType;
  dueDate?: Date;
  completedAt?: Date;
  projectId: string;
  project?: Project;
  assigneeId?: string;
  assignee?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Sale Types
export interface Sale {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  platform: PlatformType;
  status: "pending" | "completed" | "refunded" | "cancelled";
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  projectId?: string;
  project?: Project;
  saleDate: Date;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
  pendingAmount: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSales: number;
  revenueChange: number;
  expenseChange: number;
  profitChange: number;
  projectsChange: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  expense: number;
  profit?: number;
}

export interface PlatformStats {
  platform: PlatformType;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  type: "sale" | "project" | "task" | "user";
  action: "created" | "updated" | "completed" | "deleted";
  title: string;
  description?: string;
  timestamp: Date;
  userId: string;
  user?: User;
}

// Form Types
export interface ProjectFormData {
  title: string;
  description?: string;
  status: StatusType;
  priority: PriorityType;
  categoryId?: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface SaleFormData {
  title: string;
  description?: string;
  amount: number;
  currency: string;
  platform: PlatformType;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  projectId?: string;
  saleDate: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: StatusType;
  priority: PriorityType;
  dueDate?: Date;
  projectId: string;
  assigneeId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Types
export interface ProjectFilters {
  status?: StatusType[];
  priority?: PriorityType[];
  categoryId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SaleFilters {
  platform?: PlatformType[];
  status?: Sale["status"][];
  search?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// Sort Types
export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
  disabled?: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
  variant?: ColorVariant;
  hoverable?: boolean;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: ColorVariant | "ghost" | "outline" | "link";
  size?: SizeType;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: ColorVariant;
  size?: "sm" | "md" | "lg";
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  type?: FinancialType;
  loading?: boolean;
}

// Theme Types
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  radius: number;
}

