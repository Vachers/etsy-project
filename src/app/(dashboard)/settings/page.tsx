"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  CreditCard,
  HelpCircle,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Save,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: "Kullanıcı Adı",
    email: "user@example.com",
    phone: "+90 555 123 4567",
    company: "PROJEKTİF",
    timezone: "Europe/Istanbul",
    language: "tr",
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    salesAlert: true,
    weeklyReport: true,
    monthlyReport: true,
    marketingEmails: false,
  });
  
  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    sidebarCollapsed: false,
    compactMode: false,
    animations: true,
  });

  const settingsMenu = [
    { id: "profile", label: "Profil", icon: User, description: "Kişisel bilgilerinizi yönetin" },
    { id: "notifications", label: "Bildirimler", icon: Bell, description: "Bildirim tercihlerinizi ayarlayın" },
    { id: "appearance", label: "Görünüm", icon: Palette, description: "Tema ve görünüm ayarları" },
    { id: "security", label: "Güvenlik", icon: Shield, description: "Şifre ve güvenlik ayarları" },
    { id: "integrations", label: "Entegrasyonlar", icon: Globe, description: "Üçüncü parti bağlantılar" },
    { id: "billing", label: "Faturalandırma", icon: CreditCard, description: "Ödeme ve abonelik" },
    { id: "help", label: "Yardım", icon: HelpCircle, description: "Destek ve dokümantasyon" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-sm text-gray-500 mt-1">Hesap ve uygulama ayarlarınızı yönetin</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Menu */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                      activeTab === item.id
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Ayarları
                </CardTitle>
                <CardDescription>
                  Kişisel bilgilerinizi ve hesap ayarlarınızı güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Fotoğraf Değiştir</Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG veya GIF. Maks 2MB.</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>İsim</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Şirket</Label>
                    <Input
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Saat Dilimi</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Istanbul">Türkiye (GMT+3)</SelectItem>
                        <SelectItem value="Europe/London">Londra (GMT)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Dil</Label>
                    <Select
                      value={profile.language}
                      onValueChange={(value) => setProfile({ ...profile, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Bildirim Ayarları
                </CardTitle>
                <CardDescription>
                  Nasıl ve ne zaman bildirim almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Bildirim Kanalları</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
                          <p className="text-sm text-gray-500">Önemli güncellemeleri e-posta ile alın</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                          <Bell className="h-5 w-5 text-secondary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Push Bildirimleri</p>
                          <p className="text-sm text-gray-500">Tarayıcı bildirimleri alın</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-warning-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">SMS Bildirimleri</p>
                          <p className="text-sm text-gray-500">Kritik uyarıları SMS ile alın</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Bildirim Türleri</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">Satış Uyarıları</p>
                        <p className="text-sm text-gray-500">Yeni satış olduğunda bildirim al</p>
                      </div>
                      <Switch
                        checked={notifications.salesAlert}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, salesAlert: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">Haftalık Rapor</p>
                        <p className="text-sm text-gray-500">Her hafta performans özeti</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">Aylık Rapor</p>
                        <p className="text-sm text-gray-500">Her ay detaylı analiz raporu</p>
                      </div>
                      <Switch
                        checked={notifications.monthlyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Görünüm Ayarları
                </CardTitle>
                <CardDescription>
                  Arayüz görünümünü kişiselleştirin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Tema</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "light" })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                        appearance.theme === "light"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center">
                        <Sun className="h-6 w-6 text-yellow-500" />
                      </div>
                      <span className="text-sm font-medium">Açık</span>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                        appearance.theme === "dark"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="h-12 w-12 rounded-full bg-gray-900 border shadow-sm flex items-center justify-center">
                        <Moon className="h-6 w-6 text-gray-300" />
                      </div>
                      <span className="text-sm font-medium">Koyu</span>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "system" })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                        appearance.theme === "system"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white to-gray-900 border shadow-sm flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-primary-500" />
                      </div>
                      <span className="text-sm font-medium">Sistem</span>
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Arayüz Seçenekleri</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Kompakt Mod</p>
                        <p className="text-sm text-gray-500">Daha az boşluk ile daha fazla içerik</p>
                      </div>
                      <Switch
                        checked={appearance.compactMode}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Animasyonlar</p>
                        <p className="text-sm text-gray-500">Geçiş animasyonlarını etkinleştir</p>
                      </div>
                      <Switch
                        checked={appearance.animations}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, animations: checked })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Güvenlik Ayarları
                </CardTitle>
                <CardDescription>
                  Hesabınızın güvenliğini yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Şifre Değiştir</h3>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Mevcut Şifre</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>Yeni Şifre</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>Yeni Şifre (Tekrar)</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button>Şifreyi Güncelle</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">İki Faktörlü Doğrulama</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">2FA Etkinleştir</p>
                        <p className="text-sm text-gray-500">Ekstra güvenlik için iki faktörlü doğrulama</p>
                      </div>
                    </div>
                    <Button variant="outline">Ayarla</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Aktif Oturumlar</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary-100 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Chrome - Windows</p>
                          <p className="text-xs text-gray-500">İstanbul, Türkiye • Şu an aktif</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-secondary-100 text-secondary-700">Mevcut</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === "integrations" || activeTab === "billing" || activeTab === "help") && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "integrations" && "Entegrasyonlar"}
                  {activeTab === "billing" && "Faturalandırma"}
                  {activeTab === "help" && "Yardım & Destek"}
                </CardTitle>
                <CardDescription>
                  Bu bölüm yakında eklenecek
                </CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Bu özellik geliştirme aşamasında</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


