"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";

interface Membership {
  id: string;
  name: string;
  service: string;
  plan: string;
  status: "active" | "expiring" | "expired" | "cancelled";
  billingCycle: "monthly" | "yearly" | "lifetime";
  startDate: Date;
  nextBillingDate?: Date;
  price: number;
  autoRenew: boolean;
  category: "development" | "design" | "marketing" | "productivity" | "hosting" | "other";
  notes?: string;
}

const mockMemberships: Membership[] = [
  {
    id: "mem-1",
    name: "GitHub Pro",
    service: "GitHub",
    plan: "Pro",
    status: "active",
    billingCycle: "monthly",
    startDate: new Date("2023-01-15"),
    nextBillingDate: new Date("2024-12-15"),
    price: 4,
    autoRenew: true,
    category: "development",
  },
  {
    id: "mem-2",
    name: "Notion Team",
    service: "Notion",
    plan: "Team",
    status: "active",
    billingCycle: "yearly",
    startDate: new Date("2024-03-01"),
    nextBillingDate: new Date("2025-03-01"),
    price: 96,
    autoRenew: true,
    category: "productivity",
  },
  {
    id: "mem-3",
    name: "Canva Pro",
    service: "Canva",
    plan: "Pro",
    status: "expiring",
    billingCycle: "yearly",
    startDate: new Date("2024-01-01"),
    nextBillingDate: new Date("2024-12-20"),
    price: 119.99,
    autoRenew: false,
    category: "design",
  },
  {
    id: "mem-4",
    name: "Mailchimp Standard",
    service: "Mailchimp",
    plan: "Standard",
    status: "active",
    billingCycle: "monthly",
    startDate: new Date("2024-06-01"),
    nextBillingDate: new Date("2024-12-01"),
    price: 20,
    autoRenew: true,
    category: "marketing",
  },
  {
    id: "mem-5",
    name: "Vercel Pro",
    service: "Vercel",
    plan: "Pro",
    status: "active",
    billingCycle: "monthly",
    startDate: new Date("2024-02-15"),
    nextBillingDate: new Date("2024-12-15"),
    price: 20,
    autoRenew: true,
    category: "hosting",
  },
  {
    id: "mem-6",
    name: "Spotify Premium",
    service: "Spotify",
    plan: "Premium",
    status: "active",
    billingCycle: "monthly",
    startDate: new Date("2021-05-01"),
    nextBillingDate: new Date("2024-12-01"),
    price: 9.99,
    autoRenew: true,
    category: "other",
  },
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-secondary-100 text-secondary-700", icon: CheckCircle },
  expiring: { label: "Süresi Yaklaşıyor", color: "bg-amber-100 text-amber-700", icon: Clock },
  expired: { label: "Süresi Doldu", color: "bg-red-100 text-red-700", icon: AlertCircle },
  cancelled: { label: "İptal Edildi", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

const categoryConfig = {
  development: { label: "Geliştirme", color: "bg-blue-100 text-blue-700" },
  design: { label: "Tasarım", color: "bg-pink-100 text-pink-700" },
  marketing: { label: "Pazarlama", color: "bg-orange-100 text-orange-700" },
  productivity: { label: "Verimlilik", color: "bg-purple-100 text-purple-700" },
  hosting: { label: "Hosting", color: "bg-cyan-100 text-cyan-700" },
  other: { label: "Diğer", color: "bg-gray-100 text-gray-700" },
};

export default function MembershipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [memberships] = useState<Membership[]>(mockMemberships);

  const filteredMemberships = memberships.filter((membership) =>
    membership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    membership.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysUntilBilling = (date?: Date) => {
    if (!date) return null;
    return differenceInDays(date, new Date());
  };

  const totalMemberships = memberships.length;
  const activeMemberships = memberships.filter((m) => m.status === "active").length;
  const monthlySpend = memberships.reduce((sum, m) => {
    if (m.billingCycle === "monthly") return sum + m.price;
    if (m.billingCycle === "yearly") return sum + (m.price / 12);
    return sum;
  }, 0);
  const yearlySpend = monthlySpend * 12;

  const upcomingPayments = memberships
    .filter((m) => m.nextBillingDate && getDaysUntilBilling(m.nextBillingDate)! <= 30)
    .sort((a, b) => a.nextBillingDate!.getTime() - b.nextBillingDate!.getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Üyelikler</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Servis aboneliklerinizi ve üyeliklerinizi takip edin
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Üyelik Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Üyelik Ekle</DialogTitle>
              <DialogDescription>
                Servis üyelik bilgilerini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Servis Adı</Label>
                  <Input placeholder="GitHub" />
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Input placeholder="Pro" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Geliştirme</SelectItem>
                      <SelectItem value="design">Tasarım</SelectItem>
                      <SelectItem value="marketing">Pazarlama</SelectItem>
                      <SelectItem value="productivity">Verimlilik</SelectItem>
                      <SelectItem value="hosting">Hosting</SelectItem>
                      <SelectItem value="other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fatura Dönemi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Dönem seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Aylık</SelectItem>
                      <SelectItem value="yearly">Yıllık</SelectItem>
                      <SelectItem value="lifetime">Ömür Boyu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sonraki Fatura Tarihi</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Ücret ($)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMemberships}</p>
                <p className="text-sm text-gray-500">Toplam Üyelik</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeMemberships}</p>
                <p className="text-sm text-gray-500">Aktif Üyelik</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${monthlySpend.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Aylık Maliyet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${yearlySpend.toFixed(0)}</p>
                <p className="text-sm text-gray-500">Yıllık Maliyet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Üyelik ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Memberships Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredMemberships.map((membership) => {
              const StatusIcon = statusConfig[membership.status].icon;
              const daysLeft = getDaysUntilBilling(membership.nextBillingDate);

              return (
                <Card key={membership.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{membership.service}</CardTitle>
                        <CardDescription>{membership.plan}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Servise Git
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Yenile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            İptal Et
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={categoryConfig[membership.category].color}>
                        {categoryConfig[membership.category].label}
                      </Badge>
                      <Badge className={cn("gap-1", statusConfig[membership.status].color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[membership.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ücret</span>
                        <span className="font-medium">
                          ${membership.price}/{membership.billingCycle === "monthly" ? "ay" : membership.billingCycle === "yearly" ? "yıl" : "tek seferlik"}
                        </span>
                      </div>
                      {membership.nextBillingDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Sonraki Fatura</span>
                          <span className={cn(
                            daysLeft !== null && daysLeft <= 7 ? "text-red-600 font-medium" : ""
                          )}>
                            {format(membership.nextBillingDate, "d MMM yyyy", { locale: tr })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Otomatik Yenileme</span>
                        <span>{membership.autoRenew ? "Açık" : "Kapalı"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Upcoming Payments */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Yaklaşan Ödemeler</CardTitle>
              <CardDescription>Önümüzdeki 30 gün içindeki ödemeler</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingPayments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingPayments.map((membership) => {
                    const daysLeft = getDaysUntilBilling(membership.nextBillingDate);
                    return (
                      <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="font-medium">{membership.service}</p>
                          <p className="text-sm text-gray-500">
                            {daysLeft !== null && daysLeft <= 0 
                              ? "Bugün" 
                              : `${daysLeft} gün sonra`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${membership.price}</p>
                          <p className="text-xs text-gray-500">
                            {format(membership.nextBillingDate!, "d MMM", { locale: tr })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Yaklaşan ödeme yok
                </p>
              )}
            </CardContent>
          </Card>

          {/* Category Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kategori Özeti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const categoryMemberships = memberships.filter((m) => m.category === key);
                  const categoryMonthly = categoryMemberships.reduce((sum, m) => {
                    if (m.billingCycle === "monthly") return sum + m.price;
                    if (m.billingCycle === "yearly") return sum + (m.price / 12);
                    return sum;
                  }, 0);

                  if (categoryMemberships.length === 0) return null;

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={config.color}>{config.label}</Badge>
                        <span className="text-sm text-gray-500">({categoryMemberships.length})</span>
                      </div>
                      <span className="font-medium">${categoryMonthly.toFixed(2)}/ay</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


