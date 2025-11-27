"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Star,
  Check,
  X,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { salesPlatforms } from "@/lib/platforms";

// Mock satış hesapları
const mockSalesAccounts = [
  {
    id: "1",
    name: "Ana Etsy Dükkanım",
    platformId: "etsy",
    platformName: "Etsy",
    platformColor: "#f56400",
    shopName: "DigitalDesignsShop",
    shopUrl: "https://www.etsy.com/shop/DigitalDesignsShop",
    username: "digitaldesigns",
    email: "etsy@example.com",
    isActive: true,
    isDefault: true,
    listingsCount: 45,
    totalRevenue: 12500,
  },
  {
    id: "2",
    name: "Gumroad Ana Hesap",
    platformId: "gumroad",
    platformName: "Gumroad",
    platformColor: "#ff90e8",
    shopName: "CreativeAssets",
    shopUrl: "https://creativeassets.gumroad.com",
    username: "creativeassets",
    email: "gumroad@example.com",
    isActive: true,
    isDefault: true,
    listingsCount: 28,
    totalRevenue: 8400,
  },
  {
    id: "3",
    name: "İkinci Etsy Dükkanı",
    platformId: "etsy",
    platformName: "Etsy",
    platformColor: "#f56400",
    shopName: "PrintableArtStore",
    shopUrl: "https://www.etsy.com/shop/PrintableArtStore",
    username: "printablearts",
    email: "etsy2@example.com",
    isActive: true,
    isDefault: false,
    listingsCount: 32,
    totalRevenue: 5600,
  },
  {
    id: "4",
    name: "Amazon KDP Hesabı",
    platformId: "amazon-kdp",
    platformName: "Amazon KDP",
    platformColor: "#ff9900",
    shopName: "",
    shopUrl: "https://kdp.amazon.com",
    username: "author_account",
    email: "kdp@example.com",
    isActive: true,
    isDefault: true,
    listingsCount: 15,
    totalRevenue: 3200,
  },
  {
    id: "5",
    name: "Creative Market Shop",
    platformId: "creative-market",
    platformName: "Creative Market",
    platformColor: "#8bc34a",
    shopName: "DesignStudio",
    shopUrl: "https://creativemarket.com/DesignStudio",
    username: "designstudio",
    email: "cm@example.com",
    isActive: false,
    isDefault: true,
    listingsCount: 8,
    totalRevenue: 1800,
  },
];

export default function SalesAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState(mockSalesAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<typeof mockSalesAccounts[0] | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    platformId: "",
    shopName: "",
    shopUrl: "",
    username: "",
    email: "",
    isDefault: false,
    notes: "",
  });

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || account.platformId === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  // Get unique platforms from accounts
  const usedPlatforms = [...new Set(accounts.map((a) => a.platformId))];

  const handleCreateAccount = () => {
    setEditingAccount(null);
    setFormData({
      name: "",
      platformId: "",
      shopName: "",
      shopUrl: "",
      username: "",
      email: "",
      isDefault: false,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: typeof mockSalesAccounts[0]) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      platformId: account.platformId,
      shopName: account.shopName || "",
      shopUrl: account.shopUrl || "",
      username: account.username || "",
      email: account.email || "",
      isDefault: account.isDefault,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleSaveAccount = () => {
    if (!formData.name || !formData.platformId) {
      return;
    }

    const platform = salesPlatforms.find((p) => p.slug === formData.platformId);
    
    if (editingAccount) {
      // Update existing
      setAccounts(accounts.map((a) => 
        a.id === editingAccount.id 
          ? {
              ...a,
              ...formData,
              platformName: platform?.name || "",
              platformColor: platform?.color || "#2563eb",
            }
          : a
      ));
    } else {
      // Create new
      const newAccount = {
        id: Date.now().toString(),
        ...formData,
        platformName: platform?.name || "",
        platformColor: platform?.color || "#2563eb",
        isActive: true,
        listingsCount: 0,
        totalRevenue: 0,
      };
      setAccounts([...accounts, newAccount]);
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setAccounts(accounts.map((a) => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="h-7 w-7 text-primary-500" />
            Satış Hesapları
          </h1>
          <p className="text-gray-500 mt-1">
            Platform satış hesaplarınızı yönetin
          </p>
        </div>
        <Button onClick={handleCreateAccount} className="bg-primary-500 hover:bg-primary-600">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hesap Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Toplam Hesap</p>
            <p className="text-2xl font-bold text-primary-600">{accounts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Aktif Hesap</p>
            <p className="text-2xl font-bold text-green-600">
              {accounts.filter((a) => a.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Toplam Listeleme</p>
            <p className="text-2xl font-bold text-amber-600">
              {accounts.reduce((sum, a) => sum + a.listingsCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Toplam Gelir</p>
            <p className="text-2xl font-bold text-emerald-600">
              ${accounts.reduce((sum, a) => sum + a.totalRevenue, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Hesap ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Platform Filtrele" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Platformlar</SelectItem>
            {salesPlatforms.map((platform) => (
              <SelectItem key={platform.slug} value={platform.slug}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }} 
                  />
                  {platform.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => (
          <Card 
            key={account.id} 
            className={`transition-all hover:shadow-lg cursor-pointer group border-2 hover:border-primary-200 ${!account.isActive ? 'opacity-60' : ''}`}
            onClick={() => router.push(`/settings/sales-accounts/${account.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: account.platformColor }}
                  >
                    {account.platformName.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2 group-hover:text-primary-600 transition-colors">
                      {account.name}
                      {account.isDefault && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {account.platformName}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditAccount(account); }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    {account.shopUrl && (
                      <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                        <a href={account.shopUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Mağazayı Aç
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleActive(account.id); }}>
                      {account.isActive ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Deaktif Et
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Aktif Et
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); handleDeleteAccount(account.id); }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {account.shopName && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Mağaza</span>
                  <span className="font-medium">{account.shopName}</span>
                </div>
              )}
              {account.username && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Kullanıcı</span>
                  <span className="font-medium">@{account.username}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Listeleme</span>
                <span className="font-medium">{account.listingsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Gelir</span>
                <span className="font-medium text-emerald-600">
                  ${account.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <Badge 
                  variant={account.isActive ? "default" : "secondary"}
                  className={account.isActive ? "bg-green-100 text-green-700" : ""}
                >
                  {account.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Hesap Bulunamadı</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm || selectedPlatform !== "all" 
              ? "Arama kriterlerinize uygun hesap bulunamadı."
              : "Henüz satış hesabı eklemediniz."}
          </p>
          <Button onClick={handleCreateAccount} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            İlk Hesabınızı Ekleyin
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? "Hesabı Düzenle" : "Yeni Satış Hesabı"}
            </DialogTitle>
            <DialogDescription>
              {editingAccount 
                ? "Satış hesabı bilgilerini güncelleyin."
                : "Yeni bir platform satış hesabı ekleyin."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platformId">Platform *</Label>
              <Select 
                value={formData.platformId} 
                onValueChange={(value) => setFormData({ ...formData, platformId: value })}
                disabled={!!editingAccount}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Platform seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {salesPlatforms.map((platform) => (
                    <SelectItem key={platform.slug} value={platform.slug}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: platform.color }} 
                        />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Hesap Adı *</Label>
              <Input
                id="name"
                placeholder="örn: Ana Etsy Dükkanım"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Mağaza Adı</Label>
                <Input
                  id="shopName"
                  placeholder="örn: DigitalDesigns"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  placeholder="örn: designer123"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopUrl">Mağaza URL</Label>
              <Input
                id="shopUrl"
                type="url"
                placeholder="https://..."
                value={formData.shopUrl}
                onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
              />
              <Label htmlFor="isDefault">
                Bu platformda varsayılan hesap olarak ayarla
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                placeholder="Hesap ile ilgili notlar..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button 
              onClick={handleSaveAccount}
              disabled={!formData.name || !formData.platformId}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingAccount ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

