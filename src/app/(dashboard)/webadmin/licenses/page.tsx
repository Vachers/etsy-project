"use client";

import { useState } from "react";
import {
  Key,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface License {
  id: string;
  name: string;
  product: string;
  licenseKey: string;
  status: "active" | "expiring" | "expired" | "suspended";
  type: "perpetual" | "subscription" | "trial";
  purchaseDate: Date;
  expiryDate?: Date;
  seats: number;
  usedSeats: number;
  price: number;
  vendor: string;
  project?: string;
}

const mockLicenses: License[] = [
  {
    id: "lic-1",
    name: "JetBrains All Products",
    product: "JetBrains IDE",
    licenseKey: "XXXX-XXXX-XXXX-XXXX",
    status: "active",
    type: "subscription",
    purchaseDate: new Date("2024-01-15"),
    expiryDate: new Date("2025-01-15"),
    seats: 5,
    usedSeats: 3,
    price: 649,
    vendor: "JetBrains",
    project: "Development Team",
  },
  {
    id: "lic-2",
    name: "Adobe Creative Cloud",
    product: "Adobe CC",
    licenseKey: "YYYY-YYYY-YYYY-YYYY",
    status: "active",
    type: "subscription",
    purchaseDate: new Date("2024-03-01"),
    expiryDate: new Date("2025-03-01"),
    seats: 2,
    usedSeats: 2,
    price: 599.88,
    vendor: "Adobe",
  },
  {
    id: "lic-3",
    name: "Microsoft 365 Business",
    product: "Microsoft 365",
    licenseKey: "ZZZZ-ZZZZ-ZZZZ-ZZZZ",
    status: "expiring",
    type: "subscription",
    purchaseDate: new Date("2024-01-01"),
    expiryDate: new Date("2024-12-15"),
    seats: 10,
    usedSeats: 8,
    price: 1200,
    vendor: "Microsoft",
  },
  {
    id: "lic-4",
    name: "Figma Professional",
    product: "Figma",
    licenseKey: "AAAA-BBBB-CCCC-DDDD",
    status: "active",
    type: "subscription",
    purchaseDate: new Date("2024-06-01"),
    expiryDate: new Date("2025-06-01"),
    seats: 3,
    usedSeats: 2,
    price: 540,
    vendor: "Figma",
  },
  {
    id: "lic-5",
    name: "Sublime Text",
    product: "Sublime Text",
    licenseKey: "EEEE-FFFF-GGGG-HHHH",
    status: "active",
    type: "perpetual",
    purchaseDate: new Date("2022-05-20"),
    seats: 1,
    usedSeats: 1,
    price: 99,
    vendor: "Sublime HQ",
  },
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-secondary-100 text-secondary-700", icon: CheckCircle },
  expiring: { label: "Süresi Yaklaşıyor", color: "bg-amber-100 text-amber-700", icon: Clock },
  expired: { label: "Süresi Doldu", color: "bg-red-100 text-red-700", icon: AlertCircle },
  suspended: { label: "Askıda", color: "bg-gray-100 text-gray-700", icon: AlertCircle },
};

const typeLabels = {
  perpetual: { label: "Kalıcı", color: "bg-purple-100 text-purple-700" },
  subscription: { label: "Abonelik", color: "bg-blue-100 text-blue-700" },
  trial: { label: "Deneme", color: "bg-gray-100 text-gray-700" },
};

export default function LicensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [licenses] = useState<License[]>(mockLicenses);

  const filteredLicenses = licenses.filter((license) =>
    license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysUntilExpiry = (date?: Date) => {
    if (!date) return null;
    return differenceInDays(date, new Date());
  };

  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter((l) => l.status === "active").length;
  const totalSeats = licenses.reduce((sum, l) => sum + l.seats, 0);
  const yearlySpend = licenses.reduce((sum, l) => sum + l.price, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lisanslar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Yazılım lisanslarınızı ve aboneliklerinizi yönetin
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Lisans Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Lisans Ekle</DialogTitle>
              <DialogDescription>
                Yazılım lisans bilgilerini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lisans Adı</Label>
                <Input placeholder="JetBrains All Products" />
              </div>
              <div className="space-y-2">
                <Label>Ürün</Label>
                <Input placeholder="JetBrains IDE" />
              </div>
              <div className="space-y-2">
                <Label>Lisans Anahtarı</Label>
                <Input placeholder="XXXX-XXXX-XXXX-XXXX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tip</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perpetual">Kalıcı</SelectItem>
                      <SelectItem value="subscription">Abonelik</SelectItem>
                      <SelectItem value="trial">Deneme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Koltuk Sayısı</Label>
                  <Input type="number" placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bitiş Tarihi</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Yıllık Ücret ($)</Label>
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
                <Key className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLicenses}</p>
                <p className="text-sm text-gray-500">Toplam Lisans</p>
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
                <p className="text-2xl font-bold">{activeLicenses}</p>
                <p className="text-sm text-gray-500">Aktif Lisans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <Key className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSeats}</p>
                <p className="text-sm text-gray-500">Toplam Koltuk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${yearlySpend.toFixed(0)}</p>
                <p className="text-sm text-gray-500">Yıllık Harcama</p>
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
            placeholder="Lisans ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Licenses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lisans</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Koltuk</TableHead>
                <TableHead>Bitiş Tarihi</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Ücret</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => {
                const StatusIcon = statusConfig[license.status].icon;
                const daysLeft = getDaysUntilExpiry(license.expiryDate);
                return (
                  <TableRow key={license.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{license.name}</p>
                        <p className="text-sm text-gray-500">{license.product}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeLabels[license.type].color}>
                        {typeLabels[license.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1", statusConfig[license.status].color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[license.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{license.usedSeats}</span>
                        <span className="text-gray-400">/</span>
                        <span>{license.seats}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {license.expiryDate ? (
                        <div>
                          <p>{format(license.expiryDate, "d MMM yyyy", { locale: tr })}</p>
                          {daysLeft !== null && (
                            <p className={cn(
                              "text-xs",
                              daysLeft <= 30 ? "text-red-600" : daysLeft <= 90 ? "text-amber-600" : "text-gray-500"
                            )}>
                              {daysLeft > 0 ? `${daysLeft} gün kaldı` : "Süresi doldu"}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Süresiz</span>
                      )}
                    </TableCell>
                    <TableCell>{license.vendor}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${license.price.toFixed(2)}/yıl
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => copyToClipboard(license.licenseKey)}
                          >
                            <Copy className="h-4 w-4" />
                            Anahtarı Kopyala
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Vendor Sitesi
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
    </div>
  );
}


