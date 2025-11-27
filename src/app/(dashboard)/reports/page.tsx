"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Eye,
  Target,
  Zap,
  Activity,
  Filter,
  ChevronDown,
  MoreHorizontal,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency } from "@/lib/utils";

// Mock data
const summaryStats = [
  {
    title: "Toplam Gelir",
    value: "$124,560",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-200",
  },
  {
    title: "Toplam Satış",
    value: "3,847",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
  },
  {
    title: "Aktif Müşteri",
    value: "1,234",
    change: "+5.1%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
  },
  {
    title: "Aktif Ürün",
    value: "89",
    change: "-2.3%",
    trend: "down",
    icon: Package,
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    borderColor: "border-amber-200",
  },
];

const topProducts = [
  { id: 1, name: "React ile Modern Web Geliştirme", category: "E-book", sales: 234, revenue: 5240.50, growth: 12, rating: 4.8, views: 12500 },
  { id: 2, name: "UI/UX Design Kit Pro", category: "Digital Product", sales: 189, revenue: 4720.00, growth: 8, rating: 4.9, views: 9800 },
  { id: 3, name: "Complete Business Bundle", category: "Bundle", sales: 156, revenue: 7800.00, growth: 15, rating: 4.7, views: 7650 },
  { id: 4, name: "Social Media Templates", category: "Social Media", sales: 145, revenue: 2175.00, growth: -3, rating: 4.5, views: 8900 },
  { id: 5, name: "Indie Game Starter Kit", category: "Game", sales: 123, revenue: 6150.00, growth: 22, rating: 4.6, views: 5400 },
];

const platformStats = [
  { name: "Etsy", revenue: 45230, sales: 1234, commission: 2940, color: "#f56400", growth: 18 },
  { name: "Gumroad", revenue: 32150, sales: 892, commission: 3215, color: "#ff90e8", growth: 12 },
  { name: "Amazon KDP", revenue: 28400, sales: 756, commission: 8520, color: "#ff9900", growth: 8 },
  { name: "Creative Market", revenue: 18780, sales: 445, commission: 7512, color: "#8bc34a", growth: -5 },
];

const monthlyData = [
  { month: "Ocak", revenue: 12500, sales: 320, target: 15000 },
  { month: "Şubat", revenue: 14200, sales: 356, target: 15000 },
  { month: "Mart", revenue: 11800, sales: 298, target: 15000 },
  { month: "Nisan", revenue: 15600, sales: 412, target: 16000 },
  { month: "Mayıs", revenue: 18200, sales: 478, target: 18000 },
  { month: "Haziran", revenue: 16800, sales: 445, target: 18000 },
  { month: "Temmuz", revenue: 19500, sales: 512, target: 20000 },
  { month: "Ağustos", revenue: 21200, sales: 548, target: 20000 },
  { month: "Eylül", revenue: 18900, sales: 489, target: 20000 },
  { month: "Ekim", revenue: 22400, sales: 576, target: 22000 },
  { month: "Kasım", revenue: 24560, sales: 623, target: 24000 },
  { month: "Aralık", revenue: 26800, sales: 680, target: 26000 },
];

const categoryConfig: Record<string, string> = {
  "E-book": "bg-blue-100 text-blue-700 border-blue-200",
  "Digital Product": "bg-purple-100 text-purple-700 border-purple-200",
  "Bundle": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Social Media": "bg-pink-100 text-pink-700 border-pink-200",
  "Game": "bg-amber-100 text-amber-700 border-amber-200",
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const [activeTab, setActiveTab] = useState("overview");

  const totalRevenue = platformStats.reduce((acc, p) => acc + p.revenue, 0);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

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
              <SelectItem value="custom">Özel Tarih</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
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
                      stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
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

      {/* Professional Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-1.5">
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 gap-1 bg-transparent h-auto p-0">
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
              value="products"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-50",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25"
              )}
            >
              <Package className="h-4 w-4" />
              <span>Ürün Analizi</span>
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
            {/* Monthly Revenue Chart */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Aylık Gelir</CardTitle>
                    <CardDescription>Yıllık gelir performansı</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                    +18% YoY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[280px] flex items-end gap-1.5">
                  {monthlyData.map((data, i) => {
                    const height = (data.revenue / maxRevenue) * 220;
                    const targetHeight = (data.target / maxRevenue) * 220;
                    const isAboveTarget = data.revenue >= data.target;
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                        <div className="relative w-full">
                          {/* Target line */}
                          <div 
                            className="absolute w-full border-t-2 border-dashed border-gray-300 z-10"
                            style={{ bottom: `${targetHeight}px` }}
                          />
                          {/* Revenue bar */}
                          <div 
                            className={cn(
                              "w-full rounded-t-md transition-all duration-300 group-hover:opacity-80",
                              isAboveTarget 
                                ? "bg-gradient-to-t from-emerald-500 to-emerald-400" 
                                : "bg-gradient-to-t from-amber-500 to-amber-400"
                            )}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">{data.month.slice(0, 3)}</span>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded z-20">
                          ${data.revenue.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    <span>Hedef Üstü</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-amber-400" />
                    <span>Hedef Altı</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 border-t-2 border-dashed border-gray-300" />
                    <span>Hedef</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Platform Dağılımı</CardTitle>
                    <CardDescription>Gelirin platformlara göre dağılımı</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filtrele
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {platformStats.map((platform) => {
                  const percentage = Math.round((platform.revenue / totalRevenue) * 100);
                  return (
                    <div key={platform.name} className="group cursor-pointer">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: platform.color }}
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
                          <p className={cn(
                            "text-xs flex items-center justify-end gap-0.5",
                            platform.growth >= 0 ? "text-emerald-600" : "text-red-600"
                          )}>
                            {platform.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(platform.growth)}%
                          </p>
                        </div>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%`, backgroundColor: platform.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table - Modern */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">En Çok Satan Ürünler</CardTitle>
                  <CardDescription>Bu dönemdeki en yüksek performanslı ürünler</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Tümünü Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700">Ürün</TableHead>
                      <TableHead className="font-semibold text-gray-700">Kategori</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Görüntülenme</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Satış</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Gelir</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Puan</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Büyüme</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id} className="group hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary-600" />
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("border", categoryConfig[product.category])}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-600">
                            <Eye className="h-4 w-4" />
                            {product.views.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{product.sales}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-emerald-600">
                            {formatCurrency(product.revenue, "USD")}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-amber-500">★</span>
                            <span className="font-medium">{product.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            product.growth >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {product.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(product.growth)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem>Detayları Gör</DropdownMenuItem>
                              <DropdownMenuItem>Rapor Oluştur</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0">
                      <Package className="h-7 w-7 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                      <Badge variant="outline" className={cn("mt-1 border", categoryConfig[product.category])}>
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Eye className="h-3.5 w-3.5" />
                      </div>
                      <p className="font-bold text-gray-900">{(product.views / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-500">Görüntülenme</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </div>
                      <p className="font-bold text-gray-900">{product.sales}</p>
                      <p className="text-xs text-gray-500">Satış</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-emerald-50">
                      <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                        <DollarSign className="h-3.5 w-3.5" />
                      </div>
                      <p className="font-bold text-emerald-600">${(product.revenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-500">Gelir</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span>★</span>
                      <span className="font-medium text-gray-900">{product.rating}</span>
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      product.growth >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {product.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(product.growth)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {platformStats.map((platform) => (
              <Card key={platform.name} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div 
                  className="h-2 w-full"
                  style={{ backgroundColor: platform.color }}
                />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {platform.sales.toLocaleString()} satış
                        <span className={cn(
                          "inline-flex items-center gap-0.5 text-xs font-medium",
                          platform.growth >= 0 ? "text-emerald-600" : "text-red-600"
                        )}>
                          {platform.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(platform.growth)}%
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gray-50">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(platform.revenue, "USD")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Brüt Gelir</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-red-50">
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(platform.commission, "USD")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Komisyon</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-emerald-50">
                      <p className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(platform.revenue - platform.commission, "USD")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Net Gelir</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Komisyon Oranı</span>
                      <span className="font-medium text-gray-900">
                        {((platform.commission / platform.revenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(platform.commission / platform.revenue) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">+15%</Badge>
                </div>
                <p className="text-3xl font-bold">$195,650</p>
                <p className="text-blue-100 mt-1">Yıllık Gelir Trendi</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">92%</Badge>
                </div>
                <p className="text-3xl font-bold">$220,000</p>
                <p className="text-emerald-100 mt-1">Yıllık Hedef</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">↑ 22%</Badge>
                </div>
                <p className="text-3xl font-bold">4,850</p>
                <p className="text-purple-100 mt-1">Yeni Müşteri Trendi</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Aylık Trend Karşılaştırması</CardTitle>
              <CardDescription>Gelir ve satış trendlerinin aylık analizi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.slice(-6).map((data, i) => (
                  <div key={data.month} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-700">{data.month}</div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-lg"
                          style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                          ${data.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-20 text-right">
                        <span className={cn(
                          "inline-flex items-center gap-0.5 text-xs font-medium",
                          data.revenue >= data.target ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {data.revenue >= data.target ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {((data.revenue / data.target) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
