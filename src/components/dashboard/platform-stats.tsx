"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";
import { Store, Package, ShoppingBag, Globe } from "lucide-react";
import type { PlatformType } from "@/types";

interface PlatformStat {
  platform: PlatformType;
  sales: number;
  revenue: number;
  percentage: number;
}

interface PlatformStatsProps {
  stats?: PlatformStat[];
  className?: string;
}

const platformConfig: Record<
  PlatformType,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  etsy: {
    name: "Etsy",
    icon: Store,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
  },
  amazon: {
    name: "Amazon",
    icon: Package,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
  },
  shopify: {
    name: "Shopify",
    icon: ShoppingBag,
    color: "text-green-600",
    bgColor: "bg-green-500",
  },
  ebay: {
    name: "eBay",
    icon: ShoppingBag,
    color: "text-blue-600",
    bgColor: "bg-blue-500",
  },
  website: {
    name: "Website",
    icon: Globe,
    color: "text-purple-600",
    bgColor: "bg-purple-500",
  },
  other: {
    name: "Diğer",
    icon: ShoppingBag,
    color: "text-gray-600",
    bgColor: "bg-gray-500",
  },
};

const defaultStats: PlatformStat[] = [
  { platform: "etsy", sales: 124, revenue: 45600, percentage: 42 },
  { platform: "amazon", sales: 89, revenue: 32100, percentage: 29 },
  { platform: "shopify", sales: 56, revenue: 18900, percentage: 17 },
  { platform: "website", sales: 34, revenue: 12400, percentage: 12 },
];

export function PlatformStats({ stats = defaultStats, className }: PlatformStatsProps) {
  const totalRevenue = stats.reduce((acc, stat) => acc + stat.revenue, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Platform Performansı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {stats.map((stat) => {
            const config = platformConfig[stat.platform];
            const Icon = config.icon;

            return (
              <div key={stat.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        config.color,
                        "bg-opacity-10",
                        `bg-${stat.platform === "etsy" ? "orange" : stat.platform === "amazon" ? "yellow" : stat.platform === "shopify" ? "green" : stat.platform === "website" ? "purple" : "gray"}-100`
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {config.name}
                      </p>
                      <p className="text-xs text-gray-500">{stat.sales} satış</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(stat.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">%{stat.percentage}</p>
                  </div>
                </div>
                <Progress
                  value={stat.percentage}
                  className="h-2"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
            <p className="text-lg font-bold text-secondary-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

