"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  FolderKanban,
  ArrowUpRight,
  Plus,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface DashboardStats {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  activeProducts: number;
  totalSales: number;
  activePlatforms: number;
}

interface RecentSale {
  id: string;
  productName: string;
  platformName: string;
  amount: number;
  currency: string;
  date: string;
}

interface PlatformStat {
  id: string;
  name: string;
  slug: string;
  color: string;
  sales: number;
  revenue: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    activeProducts: 0,
    totalSales: 0,
    activePlatforms: 0,
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentSales(data.recentSales || []);
          setPlatformStats(data.platformStats || []);
        }
      } catch (error) {
        console.error("Dashboard veri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const totalPlatformRevenue = platformStats.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hoş geldiniz! İşte bugünkü özet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Rapor İndir
          </Button>
          <Link href="/digital-products/new">
            <Button size="sm" className="gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Yeni Ürün
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-secondary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(stats.totalRevenue, "USD")}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary-50">
                <DollarSign className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Toplam Satış</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSales}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent-50">
                <ShoppingCart className="h-6 w-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Aktif Ürünler</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeProducts}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Aktif Platformlar</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activePlatforms}</p>
              </div>
              <div className="p-3 rounded-lg bg-warning-50">
                <FolderKanban className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Stats & Recent Sales */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Platform Performansı</CardTitle>
          </CardHeader>
          <CardContent>
            {platformStats.length > 0 ? (
              <div className="space-y-4">
                {platformStats.slice(0, 5).map((platform) => {
                  const percentage = totalPlatformRevenue > 0 
                    ? Math.round((platform.revenue / totalPlatformRevenue) * 100) 
                    : 0;
                  return (
                    <div key={platform.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: platform.color || "#6b7280" }}
                          />
                          <span className="text-sm font-medium">{platform.name}</span>
                          <span className="text-xs text-gray-500">({platform.sales} satış)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">
                            {formatCurrency(platform.revenue, "USD")}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">%{percentage}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: platform.color || "#6b7280" 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Toplam</span>
                    <span className="text-lg font-bold text-secondary-600">
                      {formatCurrency(totalPlatformRevenue, "USD")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz satış verisi yok</p>
                <p className="text-sm">Ürün ekleyip satış yapınca burada görünecek</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Son Satışlar</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSales.length > 0 ? (
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium">{sale.productName}</p>
                      <p className="text-xs text-gray-500">{sale.platformName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-secondary-600">
                        +{formatCurrency(sale.amount, sale.currency)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(sale.date).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Henüz satış yok</p>
                <p className="text-sm">İlk satışınız burada görünecek</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/ebooks/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                  <Plus className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">E-Book Ekle</p>
                  <p className="text-xs text-gray-500">Yeni e-kitap oluştur</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/digital-products/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100">
                  <Plus className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dijital Ürün Ekle</p>
                  <p className="text-xs text-gray-500">Yeni ürün oluştur</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/sales">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100">
                  <ShoppingCart className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Satışlar</p>
                  <p className="text-xs text-gray-500">Tüm satışları görüntüle</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
                  <TrendingUp className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Raporlar</p>
                  <p className="text-xs text-gray-500">Detaylı analizler</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
