"use client";

import { useState } from "react";
import {
  HardDrive,
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Server,
  Cpu,
  MemoryStick,
  Database,
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";

interface Hosting {
  id: string;
  name: string;
  provider: string;
  type: "shared" | "vps" | "dedicated" | "cloud";
  status: "active" | "expiring" | "expired" | "suspended";
  expiryDate: Date;
  price: number;
  billingCycle: "monthly" | "yearly";
  storage: { used: number; total: number };
  bandwidth: { used: number; total: number };
  domains: string[];
  ip?: string;
  createdAt: Date;
}

const mockHosting: Hosting[] = [
  {
    id: "host-1",
    name: "Ana Website Hosting",
    provider: "Cloudways",
    type: "cloud",
    status: "active",
    expiryDate: new Date("2025-03-15"),
    price: 29.99,
    billingCycle: "monthly",
    storage: { used: 15, total: 50 },
    bandwidth: { used: 120, total: 500 },
    domains: ["example.com", "myshop.com"],
    ip: "192.168.1.100",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "host-2",
    name: "E-Ticaret VPS",
    provider: "DigitalOcean",
    type: "vps",
    status: "active",
    expiryDate: new Date("2025-01-20"),
    price: 49.99,
    billingCycle: "monthly",
    storage: { used: 45, total: 100 },
    bandwidth: { used: 350, total: 1000 },
    domains: ["shop.example.com"],
    ip: "165.22.15.200",
    createdAt: new Date("2022-01-20"),
  },
  {
    id: "host-3",
    name: "Blog Hosting",
    provider: "Bluehost",
    type: "shared",
    status: "expiring",
    expiryDate: new Date("2024-12-05"),
    price: 119.99,
    billingCycle: "yearly",
    storage: { used: 8, total: 25 },
    bandwidth: { used: 50, total: 200 },
    domains: ["blog.example.com"],
    createdAt: new Date("2023-12-05"),
  },
];

const typeLabels = {
  shared: { label: "Paylaşımlı", color: "bg-gray-100 text-gray-700" },
  vps: { label: "VPS", color: "bg-blue-100 text-blue-700" },
  dedicated: { label: "Dedicated", color: "bg-purple-100 text-purple-700" },
  cloud: { label: "Cloud", color: "bg-cyan-100 text-cyan-700" },
};

const statusConfig = {
  active: { label: "Aktif", color: "bg-secondary-100 text-secondary-700", icon: CheckCircle },
  expiring: { label: "Süresi Yaklaşıyor", color: "bg-amber-100 text-amber-700", icon: Clock },
  expired: { label: "Süresi Doldu", color: "bg-red-100 text-red-700", icon: AlertCircle },
  suspended: { label: "Askıda", color: "bg-gray-100 text-gray-700", icon: AlertCircle },
};

export default function HostingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [hostings] = useState<Hosting[]>(mockHosting);

  const filteredHostings = hostings.filter((hosting) =>
    hosting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hosting.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysUntilExpiry = (date: Date) => differenceInDays(date, new Date());

  const totalMonthly = hostings.reduce((sum, h) => {
    return sum + (h.billingCycle === "monthly" ? h.price : h.price / 12);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hosting</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Hosting hesaplarınızı ve kaynaklarınızı yönetin
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Hosting Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Hosting Ekle</DialogTitle>
              <DialogDescription>
                Hosting hesap bilgilerini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Hosting Adı</Label>
                <Input placeholder="Ana Website Hosting" />
              </div>
              <div className="space-y-2">
                <Label>Sağlayıcı</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sağlayıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloudways">Cloudways</SelectItem>
                    <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="bluehost">Bluehost</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tip</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shared">Paylaşımlı</SelectItem>
                      <SelectItem value="vps">VPS</SelectItem>
                      <SelectItem value="dedicated">Dedicated</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Server className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hostings.length}</p>
                <p className="text-sm text-gray-500">Toplam Hosting</p>
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
                <p className="text-2xl font-bold">{hostings.filter(h => h.status === "active").length}</p>
                <p className="text-sm text-gray-500">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hostings.filter(h => h.type === "cloud" || h.type === "vps").length}</p>
                <p className="text-sm text-gray-500">Cloud/VPS</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalMonthly.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Aylık Maliyet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Hosting ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Hosting Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHostings.map((hosting) => {
          const StatusIcon = statusConfig[hosting.status].icon;
          const daysLeft = getDaysUntilExpiry(hosting.expiryDate);
          const storagePercent = (hosting.storage.used / hosting.storage.total) * 100;
          const bandwidthPercent = (hosting.bandwidth.used / hosting.bandwidth.total) * 100;

          return (
            <Card key={hosting.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{hosting.name}</CardTitle>
                    <CardDescription>{hosting.provider}</CardDescription>
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
                        Panel'e Git
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
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={typeLabels[hosting.type].color}>
                    {typeLabels[hosting.type].label}
                  </Badge>
                  <Badge className={cn("gap-1", statusConfig[hosting.status].color)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[hosting.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resources */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Depolama</span>
                      <span>{hosting.storage.used} GB / {hosting.storage.total} GB</span>
                    </div>
                    <Progress value={storagePercent} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Bant Genişliği</span>
                      <span>{hosting.bandwidth.used} GB / {hosting.bandwidth.total} GB</span>
                    </div>
                    <Progress value={bandwidthPercent} className="h-2" />
                  </div>
                </div>

                {/* Info */}
                <div className="pt-3 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bitiş Tarihi</span>
                    <span className={cn(
                      daysLeft <= 30 ? "text-red-600 font-medium" : ""
                    )}>
                      {format(hosting.expiryDate, "d MMM yyyy", { locale: tr })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ücret</span>
                    <span className="font-medium">
                      ${hosting.price}/{hosting.billingCycle === "monthly" ? "ay" : "yıl"}
                    </span>
                  </div>
                  {hosting.ip && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">IP</span>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {hosting.ip}
                      </code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


