"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  activeProducts: number;
  totalSales: number;
  activePlatforms: number;
}

interface PlatformStat {
  id: string;
  name: string;
  slug: string;
  color: string;
  sales: number;
  revenue: number;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    activeProducts: 0,
    totalSales: 0,
    activePlatforms: 0,
  });
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setPlatformStats(data.platformStats || []);
      }
    } catch (error) {
      console.error("Reports veri hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPlatformRevenue = platformStats.reduce((sum, p) => sum + p.revenue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const summaryStats = [
    {
      title: "Toplam Gelir",
      value: formatCurrency(stats.totalRevenue, "USD"),
      change: stats.totalRevenue > 0 ? "+12.5%" : "0%",
      trend: stats.totalRevenue > 0 ? "up" : "neutral",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Toplam Satış",
      value: stats.totalSales.toString(),
      change: stats.totalSales > 0 ? "+8.2%" : "0%",
      trend: stats.totalSales > 0 ? "up" : "neutral",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Aktif Platformlar",
      value: stats.activePlatforms.toString(),
      change: "+5.1%",
      trend: "up",
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Aktif Ürün",
      value: stats.activeProducts.toString(),
      change: stats.activeProducts > 0 ? "+2.3%" : "0%",
      trend: stats.activeProducts > 0 ? "up" : "neutral",
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary-600" />
            Raporlar
          </h1>
          <p className="text-gray-500 mt-1">Detaylı performans analizi ve iş zekası</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-white">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="today">Bugün</SelectItem>
              <SelectItem value="this-week">Bu Hafta</SelectItem>
              <SelectItem value="this-month">Bu Ay</SelectItem>
              <SelectItem value="this-quarter">Bu Çeyrek</SelectItem>
              <SelectItem value="this-year">Bu Yıl</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Yenile</span>
          </Button>
          <Button className="gap-2 bg-primary-600 hover:bg-primary-700">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Rapor İndir</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={cn("border", stat.borderColor)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : 
                      stat.trend === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : stat.trend === "down" ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : null}
                      {stat.change}
                    </div>
                  </div>
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-1.5">
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-3 gap-1 bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-50",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary-500/25"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Genel Bakış</span>
            </TabsTrigger>
            <TabsTrigger
              value="platforms"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-50",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25"
              )}
            >
              <PieChart className="h-4 w-4" />
              <span>Platform Analizi</span>
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-50",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/25"
              )}
            >
              <LineChart className="h-4 w-4" />
              <span>Trendler</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Platform Distribution */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <div>
                  <CardTitle className="text-lg">Platform Dağılımı</CardTitle>
                  <CardDescription>Gelirin platformlara göre dağılımı</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {platformStats.length > 0 ? (
                  platformStats.map((platform) => {
                    const percentage = totalPlatformRevenue > 0 
                      ? Math.round((platform.revenue / totalPlatformRevenue) * 100) 
                      : 0;
                    return (
                      <div key={platform.id} className="group cursor-pointer">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: platform.color || "#6b7280" }}
                            >
                              {platform.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{platform.name}</span>
                              <p className="text-xs text-gray-500">{platform.sales} satış</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900">{formatCurrency(platform.revenue, "USD")}</span>
                            <p className="text-xs text-gray-500">%{percentage}</p>
                          </div>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                            style={{ width: `${percentage}%`, backgroundColor: platform.color || "#6b7280" }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <PieChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Henüz satış verisi yok</p>
                    <p className="text-sm">Satış yaptıktan sonra burada görünecek</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <CardTitle className="text-lg">Özet Bilgiler</CardTitle>
                <CardDescription>Tüm zamanların özeti</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Toplam Gelir</p>
                        <p className="text-xl font-bold text-emerald-700">{formatCurrency(stats.totalRevenue, "USD")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Toplam Satış</p>
                        <p className="text-xl font-bold text-blue-700">{stats.totalSales}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Aktif Ürünler</p>
                        <p className="text-xl font-bold text-purple-700">{stats.activeProducts}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6 mt-0">
          {platformStats.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {platformStats.map((platform) => {
                const percentage = totalPlatformRevenue > 0 
                  ? ((platform.revenue / totalPlatformRevenue) * 100).toFixed(1) 
                  : "0";
                return (
                  <Card key={platform.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div 
                      className="h-2 w-full"
                      style={{ backgroundColor: platform.color || "#6b7280" }}
                    />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: platform.color || "#6b7280" }}
                        >
                          {platform.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{platform.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            {platform.sales} satış
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-xl bg-gray-50">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(platform.revenue, "USD")}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Gelir</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-emerald-50">
                          <p className="text-2xl font-bold text-emerald-600">
                            %{percentage}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Pay</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <span>Toplam İçindeki Payı</span>
                          <span className="font-medium text-gray-900">%{percentage}</span>
                        </div>
                        <Progress 
                          value={parseFloat(percentage)} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Platform verisi yok</h3>
                <p className="text-gray-500">Satış yaptıktan sonra platform analizi burada görünecek</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">Toplam</Badge>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue, "USD")}</p>
                <p className="text-blue-100 mt-1">Toplam Gelir</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">{stats.totalSales}</Badge>
                </div>
                <p className="text-3xl font-bold">{stats.totalSales}</p>
                <p className="text-emerald-100 mt-1">Toplam Satış</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">{stats.activeProducts}</Badge>
                </div>
                <p className="text-3xl font-bold">{stats.activeProducts}</p>
                <p className="text-purple-100 mt-1">Aktif Ürünler</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performans Özeti</CardTitle>
              <CardDescription>Sistemdeki genel durum</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalSales > 0 || stats.activeProducts > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">Ürünler</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg"
                        style={{ width: `${Math.min(stats.activeProducts * 10, 100)}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                        {stats.activeProducts} ürün
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">Satışlar</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg"
                        style={{ width: `${Math.min(stats.totalSales * 5, 100)}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                        {stats.totalSales} satış
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">Gelir</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg"
                        style={{ width: stats.totalRevenue > 0 ? "60%" : "0%" }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                        {formatCurrency(stats.totalRevenue, "USD")}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <LineChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Henüz veri yok</p>
                  <p className="text-sm">Ürün ve satış ekledikçe trend verileri burada görünecek</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
