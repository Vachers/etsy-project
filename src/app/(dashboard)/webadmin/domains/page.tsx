"use client";

import { useState } from "react";
import {
  Globe,
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  DollarSign,
  Shield,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";

interface Domain {
  id: string;
  name: string;
  registrar: string;
  status: "active" | "expiring" | "expired" | "pending";
  expiryDate: Date;
  autoRenew: boolean;
  price: number;
  ssl: boolean;
  project?: string;
  notes?: string;
  createdAt: Date;
}

const mockDomains: Domain[] = [
  { id: "dom-1", name: "example.com", registrar: "Godaddy", status: "active", expiryDate: new Date("2025-06-15"), autoRenew: true, price: 149.99, ssl: true, project: "E-Ticaret Website", createdAt: new Date("2020-06-15") },
  { id: "dom-2", name: "myshop.com.tr", registrar: "Natro", status: "expiring", expiryDate: new Date("2024-12-20"), autoRenew: false, price: 89.99, ssl: true, project: "Online Mağaza", createdAt: new Date("2021-12-20") },
  { id: "dom-3", name: "portfolio.dev", registrar: "Namecheap", status: "active", expiryDate: new Date("2025-03-10"), autoRenew: true, price: 199.99, ssl: true, createdAt: new Date("2023-03-10") },
  { id: "dom-4", name: "blog.net", registrar: "Cloudflare", status: "expired", expiryDate: new Date("2024-10-01"), autoRenew: false, price: 129.99, ssl: false, createdAt: new Date("2022-10-01") },
  { id: "dom-5", name: "startup.io", registrar: "Google Domains", status: "active", expiryDate: new Date("2025-09-25"), autoRenew: true, price: 299.99, ssl: true, project: "Startup Projesi", createdAt: new Date("2024-09-25") },
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  expiring: { label: "Süresi Yaklaşıyor", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  expired: { label: "Süresi Doldu", color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
  pending: { label: "Beklemede", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock },
};

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [newDomain, setNewDomain] = useState({ name: "", registrar: "", expiryDate: "", price: "", autoRenew: true });

  const filteredDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysUntilExpiry = (date: Date) => differenceInDays(date, new Date());

  const totalDomains = domains.length;
  const activeDomains = domains.filter((d) => d.status === "active").length;
  const expiringDomains = domains.filter((d) => d.status === "expiring").length;
  const totalCost = domains.reduce((sum, d) => sum + d.price, 0);

  const handleAddDomain = () => {
    const domain: Domain = {
      id: `dom-${Date.now()}`,
      name: newDomain.name,
      registrar: newDomain.registrar,
      status: "active",
      expiryDate: new Date(newDomain.expiryDate),
      autoRenew: newDomain.autoRenew,
      price: parseFloat(newDomain.price),
      ssl: true,
      createdAt: new Date(),
    };
    setDomains([...domains, domain]);
    setNewDomain({ name: "", registrar: "", expiryDate: "", price: "", autoRenew: true });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary-600" />
            Domainler
          </h1>
          <p className="text-gray-500 mt-1">Domain kayıtlarınızı ve sürelerini takip edin</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Domain Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Yeni Domain Ekle</DialogTitle>
              <DialogDescription>Takip etmek istediğiniz domain bilgilerini girin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Domain Adı</Label>
                <Input placeholder="example.com" value={newDomain.name} onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Kayıt Firması</Label>
                <Select value={newDomain.registrar} onValueChange={(value) => setNewDomain({ ...newDomain, registrar: value })}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Firma seçin" /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Godaddy">Godaddy</SelectItem>
                    <SelectItem value="Namecheap">Namecheap</SelectItem>
                    <SelectItem value="Cloudflare">Cloudflare</SelectItem>
                    <SelectItem value="Google Domains">Google Domains</SelectItem>
                    <SelectItem value="Natro">Natro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bitiş Tarihi</Label>
                  <Input type="date" value={newDomain.expiryDate} onChange={(e) => setNewDomain({ ...newDomain, expiryDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Yıllık Ücret ($)</Label>
                  <Input type="number" placeholder="0.00" value={newDomain.price} onChange={(e) => setNewDomain({ ...newDomain, price: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>İptal</Button>
              <Button onClick={handleAddDomain} disabled={!newDomain.name || !newDomain.registrar} className="bg-primary-600 hover:bg-primary-700">Ekle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalDomains}</p>
                <p className="text-sm text-gray-500">Toplam Domain</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeDomains}</p>
                <p className="text-sm text-gray-500">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringDomains}</p>
                <p className="text-sm text-gray-500">Süresi Yaklaşan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(0)}</p>
                <p className="text-sm text-gray-500">Yıllık Maliyet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Domain ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filtrele
        </Button>
      </div>

      {/* Modern Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    Domain
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden md:table-cell">Kayıt Firması</th>
                <th className="text-left p-4 font-semibold text-gray-700">Durum</th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden lg:table-cell">Bitiş Tarihi</th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden xl:table-cell">SSL</th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden xl:table-cell">Proje</th>
                <th className="text-right p-4 font-semibold text-gray-700">Ücret</th>
                <th className="text-right p-4 font-semibold text-gray-700 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.map((domain, index) => {
                const StatusIcon = statusConfig[domain.status].icon;
                const daysLeft = getDaysUntilExpiry(domain.expiryDate);
                return (
                  <tr 
                    key={domain.id} 
                    className={cn(
                      "border-b transition-colors hover:bg-gray-50/50 group",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0">
                          <Globe className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{domain.name}</span>
                          <p className="text-xs text-gray-500 md:hidden">{domain.registrar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant="outline" className="font-normal">{domain.registrar}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("gap-1 border", statusConfig[domain.status].color)}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">{statusConfig[domain.status].label}</span>
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{format(domain.expiryDate, "d MMM yyyy", { locale: tr })}</p>
                        <p className={cn(
                          "text-xs",
                          daysLeft <= 30 ? "text-red-600" : daysLeft <= 90 ? "text-amber-600" : "text-gray-500"
                        )}>
                          {daysLeft > 0 ? `${daysLeft} gün kaldı` : `${Math.abs(daysLeft)} gün önce doldu`}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 hidden xl:table-cell">
                      {domain.ssl ? (
                        <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                          <Shield className="h-3 w-3" />
                          SSL
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4 hidden xl:table-cell">
                      {domain.project ? (
                        <span className="text-primary-600 font-medium">{domain.project}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-gray-900">${domain.price.toFixed(0)}</span>
                      <span className="text-gray-500 text-xs">/yıl</span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="gap-2"><ExternalLink className="h-4 w-4" />Ziyaret Et</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" />Düzenle</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><RefreshCw className="h-4 w-4" />Yenile</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600"><Trash2 className="h-4 w-4" />Sil</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
