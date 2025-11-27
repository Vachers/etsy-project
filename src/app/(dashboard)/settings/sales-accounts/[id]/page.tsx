"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Package,
  BarChart3,
  Calendar,
  Mail,
  User,
  Globe,
  Link as LinkIcon,
  Settings,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { salesPlatforms } from "@/lib/platforms";

// Mock account data
const getMockAccount = (id: string) => ({
  id,
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
  totalSales: 234,
  averageOrderValue: 53.42,
  lastSyncDate: "2024-01-15T10:30:00",
  createdAt: "2023-06-15",
  notes: "Ana satış hesabı, premium ürünler burada satılıyor.",
  recentSales: [
    { id: "s1", productName: "Digital Planner 2024", amount: 12.99, date: "2024-01-15" },
    { id: "s2", productName: "Budget Tracker Template", amount: 8.99, date: "2024-01-14" },
    { id: "s3", productName: "Wedding Invitation Set", amount: 24.99, date: "2024-01-14" },
    { id: "s4", productName: "Resume Template Bundle", amount: 15.99, date: "2024-01-13" },
    { id: "s5", productName: "Social Media Kit", amount: 19.99, date: "2024-01-12" },
  ],
  topProducts: [
    { id: "p1", name: "Digital Planner 2024", sales: 89, revenue: 1156.11 },
    { id: "p2", name: "Budget Tracker Template", sales: 67, revenue: 602.33 },
    { id: "p3", name: "Wedding Invitation Set", sales: 45, revenue: 1124.55 },
  ],
  monthlySales: [
    { month: "Ağu", sales: 1200 },
    { month: "Eyl", sales: 1450 },
    { month: "Eki", sales: 1800 },
    { month: "Kas", sales: 2100 },
    { month: "Ara", sales: 3200 },
    { month: "Oca", sales: 2750 },
  ],
});

export default function SalesAccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<ReturnType<typeof getMockAccount> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    shopUrl: "",
    username: "",
    email: "",
    isDefault: false,
    notes: "",
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const accountData = getMockAccount(params.id as string);
      setAccount(accountData);
      setFormData({
        name: accountData.name,
        shopName: accountData.shopName || "",
        shopUrl: accountData.shopUrl || "",
        username: accountData.username || "",
        email: accountData.email || "",
        isDefault: accountData.isDefault,
        notes: accountData.notes || "",
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleSave = () => {
    if (account) {
      setAccount({
        ...account,
        ...formData,
      });
    }
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    router.push("/settings/sales-accounts");
  };

  const handleToggleActive = () => {
    if (account) {
      setAccount({ ...account, isActive: !account.isActive });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Hesap Bulunamadı</h3>
        <p className="text-gray-500 mt-1">Bu satış hesabı mevcut değil.</p>
        <Link href="/settings/sales-accounts">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
      </div>
    );
  }

  const platform = salesPlatforms.find((p) => p.slug === account.platformId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/settings/sales-accounts">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
              style={{ backgroundColor: account.platformColor }}
            >
              {account.platformName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
                {account.isDefault && (
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                )}
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: account.platformColor }}
                />
                {account.platformName}
                {account.shopName && (
                  <>
                    <span className="text-gray-300">•</span>
                    {account.shopName}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-12 sm:ml-0">
          <Badge
            variant={account.isActive ? "default" : "secondary"}
            className={account.isActive ? "bg-green-100 text-green-700" : ""}
          >
            {account.isActive ? "Aktif" : "Pasif"}
          </Badge>
          {account.shopUrl && (
            <a href={account.shopUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Mağazayı Aç
              </Button>
            </a>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleActive}
            className={account.isActive ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"}
          >
            {account.isActive ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            {account.isActive ? "Deaktif Et" : "Aktif Et"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Gelir</p>
                <p className="text-xl font-bold text-emerald-600">
                  ${account.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Satış</p>
                <p className="text-xl font-bold text-blue-600">{account.totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Listeleme</p>
                <p className="text-xl font-bold text-purple-600">{account.listingsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ort. Sipariş</p>
                <p className="text-xl font-bold text-amber-600">${account.averageOrderValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-gray-100/80 p-1 rounded-lg">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm"
          >
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm"
          >
            Ürünler
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm"
          >
            Satışlar
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm"
          >
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hesap Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Store className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Mağaza Adı</p>
                    <p className="font-medium">{account.shopName || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Kullanıcı Adı</p>
                    <p className="font-medium">@{account.username || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">E-posta</p>
                    <p className="font-medium">{account.email || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Mağaza URL</p>
                    <p className="font-medium truncate max-w-[250px]">{account.shopUrl || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Oluşturulma Tarihi</p>
                    <p className="font-medium">{account.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">En Çok Satan Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {account.topProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} satış</p>
                        </div>
                      </div>
                      <span className="font-semibold text-emerald-600">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Sales Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Aylık Satış Grafiği</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-4">
                  {account.monthlySales.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-500"
                        style={{
                          height: `${(item.sales / Math.max(...account.monthlySales.map((s) => s.sales))) * 100}%`,
                          minHeight: "20px",
                        }}
                      />
                      <span className="text-xs text-gray-500">{item.month}</span>
                      <span className="text-xs font-medium">${item.sales}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bu Hesaptaki Ürünler</CardTitle>
              <CardDescription>Bu satış hesabında listelenen tüm ürünler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Ürün Listesi</h3>
                <p className="text-gray-500 mt-1">
                  Bu hesapta {account.listingsCount} aktif listeleme bulunuyor.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Ürün detayları için Digital Products sayfasını ziyaret edin.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Son Satışlar</CardTitle>
              <CardDescription>Bu hesaptaki son satış işlemleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {account.recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sale.productName}</p>
                        <p className="text-sm text-gray-500">{sale.date}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600">${sale.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hesap Ayarları</CardTitle>
              <CardDescription>Bu satış hesabının ayarlarını yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Hesap Durumu</p>
                    <p className="text-sm text-gray-500">Hesabı aktif veya pasif yapın</p>
                  </div>
                </div>
                <Switch checked={account.isActive} onCheckedChange={handleToggleActive} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Varsayılan Hesap</p>
                    <p className="text-sm text-gray-500">Bu platformda varsayılan hesap olarak ayarla</p>
                  </div>
                </div>
                <Switch
                  checked={account.isDefault}
                  onCheckedChange={(checked) =>
                    setAccount((prev) => (prev ? { ...prev, isDefault: checked } : null))
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hesabı Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Hesabı Düzenle</DialogTitle>
            <DialogDescription>Satış hesabı bilgilerini güncelleyin.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hesap Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Mağaza Adı</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
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
                value={formData.shopUrl}
                onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
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
              <Label htmlFor="isDefault">Bu platformda varsayılan hesap olarak ayarla</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave} className="bg-primary-500 hover:bg-primary-600">
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Hesabı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. "{account.name}" hesabı ve tüm ilişkili veriler kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


