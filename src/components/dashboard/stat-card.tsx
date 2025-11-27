"use client";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { FinancialType } from "@/types";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  type?: FinancialType;
  loading?: boolean;
  currency?: boolean;
  className?: string;
}

const typeStyles: Record<FinancialType, { bg: string; icon: string; border: string }> = {
  revenue: {
    bg: "bg-secondary-50",
    icon: "text-secondary-600",
    border: "border-secondary-200",
  },
  expense: {
    bg: "bg-accent-50",
    icon: "text-accent-600",
    border: "border-accent-200",
  },
  profit: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200",
  },
  pending: {
    bg: "bg-warning-50",
    icon: "text-warning-600",
    border: "border-warning-200",
  },
};

export function StatCard({
  title,
  value,
  change,
  changeLabel = "geçen aya göre",
  icon,
  type = "revenue",
  loading = false,
  currency = false,
  className,
}: StatCardProps) {
  const styles = typeStyles[type];

  const TrendIcon =
    change === undefined || change === 0
      ? Minus
      : change > 0
      ? TrendingUp
      : TrendingDown;

  const trendColor =
    change === undefined || change === 0
      ? "text-gray-500"
      : change > 0
      ? "text-secondary-600"
      : "text-accent-600";

  if (loading) {
    return (
      <Card className={cn("border", styles.border, className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayValue = currency && typeof value === "number" 
    ? formatCurrency(value) 
    : value;

  return (
    <Card
      className={cn(
        "border transition-all duration-200 hover:shadow-card-hover",
        styles.border,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{displayValue}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                <TrendIcon className={cn("h-4 w-4", trendColor)} />
                <span className={cn("text-sm font-medium", trendColor)}>
                  {formatPercentage(change)}
                </span>
                <span className="text-xs text-gray-400">{changeLabel}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-lg", styles.bg)}>
              <div className={styles.icon}>{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

