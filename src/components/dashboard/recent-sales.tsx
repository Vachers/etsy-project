"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import { ShoppingBag, Store, Globe, Package } from "lucide-react";
import type { PlatformType } from "@/types";

interface Sale {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  platform: PlatformType;
  date: string;
}

interface RecentSalesProps {
  sales?: Sale[];
  className?: string;
}

const platformIcons: Record<PlatformType, React.ComponentType<{ className?: string }>> = {
  etsy: Store,
  amazon: Package,
  shopify: ShoppingBag,
  ebay: ShoppingBag,
  website: Globe,
  other: ShoppingBag,
};

const platformColors: Record<PlatformType, string> = {
  etsy: "bg-orange-100 text-orange-700",
  amazon: "bg-yellow-100 text-yellow-700",
  shopify: "bg-green-100 text-green-700",
  ebay: "bg-blue-100 text-blue-700",
  website: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-700",
};

const defaultSales: Sale[] = [
  {
    id: "1",
    customerName: "Ayşe Yılmaz",
    customerEmail: "ayse@email.com",
    amount: 1250,
    platform: "etsy",
    date: "5 dk önce",
  },
  {
    id: "2",
    customerName: "Mehmet Kaya",
    customerEmail: "mehmet@email.com",
    amount: 890,
    platform: "amazon",
    date: "15 dk önce",
  },
  {
    id: "3",
    customerName: "Zeynep Demir",
    customerEmail: "zeynep@email.com",
    amount: 2100,
    platform: "shopify",
    date: "1 saat önce",
  },
  {
    id: "4",
    customerName: "Ali Öztürk",
    customerEmail: "ali@email.com",
    amount: 650,
    platform: "website",
    date: "2 saat önce",
  },
  {
    id: "5",
    customerName: "Fatma Şahin",
    customerEmail: "fatma@email.com",
    amount: 1800,
    platform: "etsy",
    date: "3 saat önce",
  },
];

export function RecentSales({ sales = defaultSales, className }: RecentSalesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Son Satışlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale) => {
            const PlatformIcon = platformIcons[sale.platform];
            return (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                      {getInitials(sale.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sale.customerName}
                    </p>
                    <p className="text-xs text-gray-500">{sale.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={cn("gap-1", platformColors[sale.platform])}
                  >
                    <PlatformIcon className="h-3 w-3" />
                    {sale.platform.charAt(0).toUpperCase() + sale.platform.slice(1)}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-600">
                      +{formatCurrency(sale.amount)}
                    </p>
                    <p className="text-xs text-gray-400">{sale.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

