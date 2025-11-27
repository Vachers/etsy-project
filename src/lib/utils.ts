import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = "TRY",
  locale: string = "tr-TR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with locale-specific formatting
 */
export function formatNumber(
  value: number,
  locale: string = "tr-TR",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Color variant mappings for semantic usage
 */
export const colorVariants = {
  primary: {
    bg: "bg-primary-500",
    bgLight: "bg-primary-50",
    text: "text-primary-600",
    border: "border-primary-200",
    hover: "hover:bg-primary-600",
  },
  secondary: {
    bg: "bg-secondary-500",
    bgLight: "bg-secondary-50",
    text: "text-secondary-600",
    border: "border-secondary-200",
    hover: "hover:bg-secondary-600",
  },
  accent: {
    bg: "bg-accent-500",
    bgLight: "bg-accent-50",
    text: "text-accent-600",
    border: "border-accent-200",
    hover: "hover:bg-accent-600",
  },
  success: {
    bg: "bg-success-500",
    bgLight: "bg-success-50",
    text: "text-success-600",
    border: "border-success-200",
    hover: "hover:bg-success-600",
  },
  warning: {
    bg: "bg-warning-500",
    bgLight: "bg-warning-50",
    text: "text-warning-600",
    border: "border-warning-200",
    hover: "hover:bg-warning-600",
  },
  error: {
    bg: "bg-error-500",
    bgLight: "bg-error-50",
    text: "text-error-600",
    border: "border-error-200",
    hover: "hover:bg-error-600",
  },
} as const;

/**
 * Status color mappings
 */
export const statusColors = {
  active: "bg-success-100 text-success-800 border-success-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-warning-100 text-warning-800 border-warning-200",
  completed: "bg-secondary-100 text-secondary-800 border-secondary-200",
  cancelled: "bg-error-100 text-error-800 border-error-200",
  draft: "bg-warning-100 text-warning-800 border-warning-200",
} as const;

/**
 * Priority color mappings
 */
export const priorityColors = {
  critical: "bg-red-900 text-white",
  high: "bg-accent-500 text-white",
  medium: "bg-warning-500 text-white",
  low: "bg-gray-500 text-white",
} as const;

/**
 * Chart colors for Recharts
 */
export const chartColors = {
  primary: "#2563eb",
  secondary: "#059669",
  accent: "#dc2626",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  profit: "#7c3aed",
  extended: [
    "#2563eb", // Primary blue
    "#059669", // Secondary emerald
    "#dc2626", // Accent red
    "#7c3aed", // Purple
    "#f59e0b", // Amber
    "#10b981", // Green
    "#3b82f6", // Light blue
    "#8b5cf6", // Violet
  ],
} as const;

