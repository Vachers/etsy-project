"use client";

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  FolderKanban,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StatCard,
  RevenueChart,
  RecentSales,
  ActivityFeed,
  PlatformStats,
} from "@/components/dashboard";

export default function DashboardPage() {
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
          <Button size="sm" className="gap-2 bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4" />
            Yeni Proje
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Gelir"
          value={125840}
          change={12.5}
          icon={<DollarSign className="h-6 w-6" />}
          type="revenue"
          currency
        />
        <StatCard
          title="Toplam Gider"
          value={45320}
          change={-3.2}
          icon={<TrendingUp className="h-6 w-6" />}
          type="expense"
          currency
        />
        <StatCard
          title="Net Kar"
          value={80520}
          change={18.7}
          icon={<DollarSign className="h-6 w-6" />}
          type="profit"
          currency
        />
        <StatCard
          title="Aktif Projeler"
          value="24"
          change={5}
          icon={<FolderKanban className="h-6 w-6" />}
          type="pending"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart className="lg:col-span-2" />
        <PlatformStats />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSales />
        <ActivityFeed />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-card-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <ShoppingCart className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500">Bu ayki satışlar</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-card-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100">
              <DollarSign className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₺8,450</p>
              <p className="text-xs text-gray-500">Ortalama sipariş değeri</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-card-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100">
              <FolderKanban className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500">Bekleyen görevler</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-card-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
              <TrendingUp className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">%94</p>
              <p className="text-xs text-gray-500">Müşteri memnuniyeti</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

