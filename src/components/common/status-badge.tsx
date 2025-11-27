"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { StatusType, PriorityType } from "@/types";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: "Aktif",
    className: "bg-success-100 text-success-800 border-success-200 hover:bg-success-100",
  },
  inactive: {
    label: "Pasif",
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  },
  draft: {
    label: "Taslak",
    className: "bg-warning-100 text-warning-800 border-warning-200 hover:bg-warning-100",
  },
  completed: {
    label: "Tamamlandı",
    className: "bg-secondary-100 text-secondary-800 border-secondary-200 hover:bg-secondary-100",
  },
  cancelled: {
    label: "İptal",
    className: "bg-error-100 text-error-800 border-error-200 hover:bg-error-100",
  },
  pending: {
    label: "Beklemede",
    className: "bg-warning-100 text-warning-800 border-warning-200 hover:bg-warning-100",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("border", config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: PriorityType;
  className?: string;
}

const priorityConfig: Record<PriorityType, { label: string; className: string }> = {
  low: {
    label: "Düşük",
    className: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
  },
  medium: {
    label: "Orta",
    className: "bg-warning-100 text-warning-700 border-warning-200 hover:bg-warning-100",
  },
  high: {
    label: "Yüksek",
    className: "bg-accent-100 text-accent-700 border-accent-200 hover:bg-accent-100",
  },
  critical: {
    label: "Kritik",
    className: "bg-red-900 text-white border-red-900 hover:bg-red-900",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge variant="outline" className={cn("border", config.className, className)}>
      {config.label}
    </Badge>
  );
}

