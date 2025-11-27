"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Link,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

interface OtherItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: "active" | "pending" | "expired" | "cancelled";
  type: "service" | "subscription" | "one-time" | "contract";
  dueDate?: Date;
  price?: number;
  billingCycle?: "monthly" | "yearly" | "one-time";
  url?: string;
  project?: string;
  tags: string[];
  notes?: string;
  createdAt: Date;
}

const mockItems: OtherItem[] = [
  {
    id: "item-1",
    title: "SSL Sertifikası - Wildcard",
    description: "*.example.com için wildcard SSL sertifikası",
    category: "Güvenlik",
    status: "active",
    type: "subscription",
    dueDate: new Date("2025-06-15"),
    price: 199.99,
    billingCycle: "yearly",
    tags: ["ssl", "güvenlik"],
    createdAt: new Date("2024-06-15"),
  },
  {
    id: "item-2",
    title: "CDN Hizmeti - Cloudflare",
    description: "Cloudflare Pro planı",
    category: "Performans",
    status: "active",
    type: "subscription",
    dueDate: new Date("2024-12-20"),
    price: 25,
    billingCycle: "monthly",
    url: "https://dash.cloudflare.com",
    tags: ["cdn", "performans"],
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "item-3",
    title: "Email Hosting - Google Workspace",
    description: "5 kullanıcılık Business Starter planı",
    category: "İletişim",
    status: "active",
    type: "subscription",
    dueDate: new Date("2025-01-01"),
    price: 36,
    billingCycle: "monthly",
    project: "Şirket Genel",
    tags: ["email", "workspace"],
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "item-4",
    title: "API Entegrasyonu - Payment Gateway",
    description: "Stripe entegrasyon sözleşmesi",
    category: "Finans",
    status: "active",
    type: "contract",
    tags: ["api", "ödeme"],
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "item-5",
    title: "Backup Hizmeti - AWS S3",
    description: "Otomatik yedekleme sistemi",
    category: "Yedekleme",
    status: "pending",
    type: "service",
    price: 15,
    billingCycle: "monthly",
    tags: ["backup", "aws"],
    createdAt: new Date("2024-08-01"),
  },
  {
    id: "item-6",
    title: "Monitoring - Datadog",
    description: "Uygulama izleme ve alerting",
    category: "İzleme",
    status: "active",
    type: "subscription",
    dueDate: new Date("2025-02-15"),
    price: 31,
    billingCycle: "monthly",
    url: "https://app.datadoghq.com",
    tags: ["monitoring", "devops"],
    createdAt: new Date("2024-02-15"),
  },
];

const categories = [
  "Güvenlik",
  "Performans",
  "İletişim",
  "Finans",
  "Yedekleme",
  "İzleme",
  "Diğer",
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-secondary-100 text-secondary-700", icon: CheckCircle },
  pending: { label: "Beklemede", color: "bg-amber-100 text-amber-700", icon: Clock },
  expired: { label: "Süresi Doldu", color: "bg-red-100 text-red-700", icon: AlertCircle },
  cancelled: { label: "İptal Edildi", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

const typeConfig = {
  service: { label: "Servis", color: "bg-blue-100 text-blue-700" },
  subscription: { label: "Abonelik", color: "bg-purple-100 text-purple-700" },
  "one-time": { label: "Tek Seferlik", color: "bg-green-100 text-green-700" },
  contract: { label: "Sözleşme", color: "bg-orange-100 text-orange-700" },
};

export default function OtherPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [items] = useState<OtherItem[]>(mockItems);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDaysUntilDue = (date?: Date) => {
    if (!date) return null;
    return differenceInDays(date, new Date());
  };

  const totalItems = items.length;
  const activeItems = items.filter((i) => i.status === "active").length;
  const monthlySpend = items.reduce((sum, i) => {
    if (!i.price) return sum;
    if (i.billingCycle === "monthly") return sum + i.price;
    if (i.billingCycle === "yearly") return sum + (i.price / 12);
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Diğer</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Diğer web admin öğelerini ve servislerini yönetin
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Öğe Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni Öğe Ekle</DialogTitle>
              <DialogDescription>
                Takip etmek istediğiniz öğe bilgilerini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input placeholder="SSL Sertifikası" />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea placeholder="Öğe açıklaması..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tip</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Servis</SelectItem>
                      <SelectItem value="subscription">Abonelik</SelectItem>
                      <SelectItem value="one-time">Tek Seferlik</SelectItem>
                      <SelectItem value="contract">Sözleşme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bitiş/Yenileme Tarihi</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Ücret ($)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL (Opsiyonel)</Label>
                <Input placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Etiketler (virgülle ayırın)</Label>
                <Input placeholder="ssl, güvenlik, sertifika" />
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
                <Folder className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-gray-500">Toplam Öğe</p>
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
                <p className="text-2xl font-bold">{activeItems}</p>
                <p className="text-sm text-gray-500">Aktif Öğe</p>
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
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-gray-500">Kategori</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Öğe veya etiket ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Tümü
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const StatusIcon = statusConfig[item.status].icon;
          const daysLeft = getDaysUntilDue(item.dueDate);

          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                    {item.description && (
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.url && (
                        <DropdownMenuItem className="gap-2" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Siteye Git
                          </a>
                        </DropdownMenuItem>
                      )}
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
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <Badge className={statusConfig[item.status].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[item.status].label}
                  </Badge>
                  <Badge className={typeConfig[item.type].color}>
                    {typeConfig[item.type].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Folder className="h-4 w-4" />
                      <span>{item.category}</span>
                    </div>
                    {item.price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          ${item.price}
                          {item.billingCycle && (
                            <span className="text-gray-500">
                              /{item.billingCycle === "monthly" ? "ay" : item.billingCycle === "yearly" ? "yıl" : "tek seferlik"}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {item.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={cn(
                          daysLeft !== null && daysLeft <= 30 ? "text-amber-600" : "",
                          daysLeft !== null && daysLeft <= 7 ? "text-red-600 font-medium" : ""
                        )}>
                          {format(item.dueDate, "d MMM yyyy", { locale: tr })}
                          {daysLeft !== null && daysLeft > 0 && (
                            <span className="text-gray-400 ml-1">({daysLeft} gün)</span>
                          )}
                        </span>
                      </div>
                    )}
                    {item.url && (
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-gray-400" />
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline truncate"
                        >
                          {new URL(item.url).hostname}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap pt-2 border-t">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Öğe bulunamadı
          </h3>
          <p className="mt-2 text-gray-500">
            Arama kriterlerinize uygun öğe bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}


