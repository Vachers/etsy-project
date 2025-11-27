"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ShoppingCart,
  Store,
  Package,
  Globe,
  Eye,
  Edit,
  Trash2,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import type { PlatformType } from "@/types";

interface Sale {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  platform: PlatformType;
  status: "pending" | "completed" | "refunded" | "cancelled";
  orderId: string;
  saleDate: Date;
}

const platformConfig: Record<PlatformType, { name: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  etsy: { name: "Etsy", icon: Store, color: "bg-orange-100 text-orange-700" },
  amazon: { name: "Amazon", icon: Package, color: "bg-yellow-100 text-yellow-700" },
  shopify: { name: "Shopify", icon: ShoppingCart, color: "bg-green-100 text-green-700" },
  ebay: { name: "eBay", icon: ShoppingCart, color: "bg-blue-100 text-blue-700" },
  website: { name: "Website", icon: Globe, color: "bg-purple-100 text-purple-700" },
  other: { name: "Diğer", icon: ShoppingCart, color: "bg-gray-100 text-gray-700" },
};

const statusConfig: Record<Sale["status"], { label: string; className: string }> = {
  pending: { label: "Beklemede", className: "bg-warning-100 text-warning-800 border-warning-200" },
  completed: { label: "Tamamlandı", className: "bg-success-100 text-success-800 border-success-200" },
  refunded: { label: "İade", className: "bg-accent-100 text-accent-800 border-accent-200" },
  cancelled: { label: "İptal", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

const mockSales: Sale[] = [
  { id: "1", title: "El Yapımı Ahşap Saat", customerName: "Ayşe Yılmaz", customerEmail: "ayse@email.com", amount: 1250, platform: "etsy", status: "completed", orderId: "ETY-2024-001", saleDate: new Date("2024-02-15") },
  { id: "2", title: "Makrome Duvar Süsü", customerName: "Mehmet Kaya", customerEmail: "mehmet@email.com", amount: 890, platform: "etsy", status: "completed", orderId: "ETY-2024-002", saleDate: new Date("2024-02-14") },
  { id: "3", title: "Özel Tasarım T-Shirt", customerName: "Zeynep Demir", customerEmail: "zeynep@email.com", amount: 2100, platform: "shopify", status: "pending", orderId: "SHP-2024-001", saleDate: new Date("2024-02-14") },
  { id: "4", title: "Deri Cüzdan", customerName: "Ali Öztürk", customerEmail: "ali@email.com", amount: 650, platform: "amazon", status: "completed", orderId: "AMZ-2024-001", saleDate: new Date("2024-02-13") },
  { id: "5", title: "Seramik Kupa Seti", customerName: "Fatma Şahin", customerEmail: "fatma@email.com", amount: 1800, platform: "website", status: "completed", orderId: "WEB-2024-001", saleDate: new Date("2024-02-12") },
  { id: "6", title: "Örme Bebek Battaniyesi", customerName: "Can Yıldırım", customerEmail: "can@email.com", amount: 450, platform: "etsy", status: "refunded", orderId: "ETY-2024-003", saleDate: new Date("2024-02-11") },
  { id: "7", title: "Ahşap Oyuncak Seti", customerName: "Elif Korkmaz", customerEmail: "elif@email.com", amount: 780, platform: "amazon", status: "pending", orderId: "AMZ-2024-002", saleDate: new Date("2024-02-10") },
  { id: "8", title: "El Boyama Tablo", customerName: "Burak Arslan", customerEmail: "burak@email.com", amount: 3500, platform: "website", status: "completed", orderId: "WEB-2024-002", saleDate: new Date("2024-02-09") },
];

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSales = mockSales.filter((sale) => {
    const matchesSearch =
      sale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || sale.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const totalRevenue = filteredSales.reduce((acc, sale) => 
    sale.status === "completed" ? acc + sale.amount : acc, 0);
  const totalSales = filteredSales.filter(s => s.status === "completed").length;
  const pendingSales = filteredSales.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Satışlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm platformlardaki satışlarınızı takip edin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Dışa Aktar
          </Button>
          <Button className="gap-2 bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4" />
            Yeni Satış
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Toplam Gelir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary-600">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {totalSales} tamamlanmış satış
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Bekleyen Siparişler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning-600">{pendingSales}</p>
            <p className="text-xs text-gray-500 mt-1">İşlem bekliyor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ortalama Sipariş
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(totalSales > 0 ? totalRevenue / totalSales : 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Sipariş başına</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Satış, müşteri veya sipariş no ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Platformlar</SelectItem>
            <SelectItem value="etsy">Etsy</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="other">Diğer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="pending">Beklemede</SelectItem>
            <SelectItem value="completed">Tamamlandı</SelectItem>
            <SelectItem value="refunded">İade</SelectItem>
            <SelectItem value="cancelled">İptal</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtreler
        </Button>
      </div>

      {/* Sales Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button variant="ghost" className="gap-1 -ml-3 h-8">
                    Satış
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>
                  <Button variant="ghost" className="gap-1 -ml-3 h-8">
                    Tarih
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="gap-1 -mr-3 h-8">
                    Tutar
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => {
                const platform = platformConfig[sale.platform];
                const status = statusConfig[sale.status];
                const PlatformIcon = platform.icon;

                return (
                  <TableRow key={sale.id} className="group">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{sale.title}</p>
                        <p className="text-xs text-gray-500">{sale.orderId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                            {getInitials(sale.customerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{sale.customerName}</p>
                          <p className="text-xs text-gray-500">{sale.customerEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("gap-1", platform.color)}>
                        <PlatformIcon className="h-3 w-3" />
                        {platform.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border", status.className)}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {format(sale.saleDate, "d MMM yyyy", { locale: tr })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-semibold",
                        sale.status === "completed" ? "text-secondary-600" : 
                        sale.status === "refunded" ? "text-accent-600" : "text-gray-600"
                      )}>
                        {sale.status === "refunded" ? "-" : "+"}{formatCurrency(sale.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredSales.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Satış bulunamadı</h3>
          <p className="text-sm text-gray-500 mt-1">
            Arama kriterlerinize uygun satış bulunmuyor.
          </p>
          <Button className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Yeni Satış Ekle
          </Button>
        </div>
      )}
    </div>
  );
}

