"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  Search,
  Settings,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Globe,
  CreditCard,
  MessageSquare,
  Mail,
  BarChart3,
  Cloud,
  FileText,
  ShoppingCart,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "platform" | "payment" | "communication" | "analytics" | "storage" | "other";
  status: "connected" | "disconnected" | "error";
  color: string;
  lastSync?: Date;
  features?: string[];
}

const integrations: Integration[] = [
  {
    id: "etsy",
    name: "Etsy",
    description: "Etsy mağazanızı bağlayın ve satışlarınızı senkronize edin",
    icon: ShoppingCart,
    category: "platform",
    status: "connected",
    color: "#f56400",
    lastSync: new Date("2024-11-27T10:30:00"),
    features: ["Otomatik ürün senkronizasyonu", "Satış bildirimleri", "Stok takibi"],
  },
  {
    id: "gumroad",
    name: "Gumroad",
    description: "Gumroad ürünlerinizi ve satışlarınızı yönetin",
    icon: ShoppingCart,
    category: "platform",
    status: "connected",
    color: "#ff90e8",
    lastSync: new Date("2024-11-27T09:15:00"),
    features: ["Ürün senkronizasyonu", "Müşteri verileri", "İndirme istatistikleri"],
  },
  {
    id: "amazon-kdp",
    name: "Amazon KDP",
    description: "Kindle Direct Publishing entegrasyonu",
    icon: FileText,
    category: "platform",
    status: "disconnected",
    color: "#ff9900",
    features: ["E-kitap yayınlama", "Telif hakları takibi", "Satış raporları"],
  },
  {
    id: "creative-market",
    name: "Creative Market",
    description: "Creative Market mağaza entegrasyonu",
    icon: Globe,
    category: "platform",
    status: "error",
    color: "#8bc34a",
    features: ["Ürün listeleme", "Satış takibi", "Müşteri yorumları"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Ödeme işlemlerini yönetin",
    icon: CreditCard,
    category: "payment",
    status: "connected",
    color: "#6772e5",
    lastSync: new Date("2024-11-27T11:00:00"),
    features: ["Ödeme işleme", "Abonelik yönetimi", "Fatura oluşturma"],
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "PayPal ödeme entegrasyonu",
    icon: CreditCard,
    category: "payment",
    status: "disconnected",
    color: "#003087",
    features: ["Ödeme alma", "Para transferi", "Fatura gönderimi"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Slack bildirimleri ve iletişim",
    icon: MessageSquare,
    category: "communication",
    status: "connected",
    color: "#4A154B",
    lastSync: new Date("2024-11-27T08:00:00"),
    features: ["Satış bildirimleri", "Ekip iletişimi", "Otomatik raporlar"],
  },
  {
    id: "discord",
    name: "Discord",
    description: "Discord sunucunuza bildirimler gönderin",
    icon: MessageSquare,
    category: "communication",
    status: "disconnected",
    color: "#5865F2",
    features: ["Webhook bildirimleri", "Bot entegrasyonu", "Kanal yönetimi"],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "E-posta pazarlama otomasyonu",
    icon: Mail,
    category: "communication",
    status: "connected",
    color: "#FFE01B",
    lastSync: new Date("2024-11-26T15:30:00"),
    features: ["Liste yönetimi", "Kampanya oluşturma", "Otomatik e-postalar"],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web sitesi trafiği ve dönüşüm takibi",
    icon: BarChart3,
    category: "analytics",
    status: "connected",
    color: "#E37400",
    lastSync: new Date("2024-11-27T00:00:00"),
    features: ["Trafik analizi", "Dönüşüm takibi", "Hedef belirleme"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Dosya depolama ve paylaşım",
    icon: Cloud,
    category: "storage",
    status: "disconnected",
    color: "#4285F4",
    features: ["Otomatik yedekleme", "Dosya paylaşımı", "Ekip klasörleri"],
  },
  {
    id: "webhook",
    name: "Custom Webhook",
    description: "Özel webhook entegrasyonları oluşturun",
    icon: Webhook,
    category: "other",
    status: "disconnected",
    color: "#6B7280",
    features: ["Özel tetikleyiciler", "JSON payload", "HTTP yöntemleri"],
  },
];

const categoryLabels = {
  platform: { label: "Satış Platformları", icon: ShoppingCart },
  payment: { label: "Ödeme Sistemleri", icon: CreditCard },
  communication: { label: "İletişim", icon: MessageSquare },
  analytics: { label: "Analitik", icon: BarChart3 },
  storage: { label: "Depolama", icon: Cloud },
  other: { label: "Diğer", icon: Zap },
};

const statusConfig = {
  connected: { label: "Bağlı", color: "bg-secondary-100 text-secondary-700", icon: Check },
  disconnected: { label: "Bağlı Değil", color: "bg-gray-100 text-gray-600", icon: X },
  error: { label: "Hata", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const errorCount = integrations.filter((i) => i.status === "error").length;

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConfigDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entegrasyonlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Üçüncü parti servisleri ve platformları bağlayın
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Entegrasyon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-sm text-gray-500">Bağlı Entegrasyon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{integrations.length}</p>
                <p className="text-sm text-gray-500">Toplam Entegrasyon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{errorCount}</p>
                <p className="text-sm text-gray-500">Hatalı Bağlantı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Entegrasyon ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            Tümü
          </Button>
          {Object.entries(categoryLabels).map(([key, { label, icon: Icon }]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setActiveCategory(key)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => {
          const StatusIcon = statusConfig[integration.status].icon;
          const Icon = integration.icon;
          
          return (
            <Card key={integration.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: integration.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge
                        className={cn(
                          "mt-1 gap-1",
                          statusConfig[integration.status].color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[integration.status].label}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={integration.status === "connected"}
                    onCheckedChange={() => handleConnect(integration)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{integration.description}</p>
                
                {integration.features && (
                  <div className="space-y-1">
                    {integration.features.slice(0, 2).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <Check className="h-3 w-3 text-secondary-500" />
                        {feature}
                      </div>
                    ))}
                    {integration.features.length > 2 && (
                      <p className="text-xs text-gray-400">
                        +{integration.features.length - 2} daha fazla özellik
                      </p>
                    )}
                  </div>
                )}

                {integration.lastSync && (
                  <p className="text-xs text-gray-400">
                    Son senkronizasyon: {integration.lastSync.toLocaleString("tr-TR")}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  {integration.status === "connected" ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Settings className="h-4 w-4" />
                        Ayarlar
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </>
                  ) : integration.status === "error" ? (
                    <Button variant="destructive" size="sm" className="flex-1 gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Yeniden Bağlan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleConnect(integration)}
                    >
                      <Zap className="h-4 w-4" />
                      Bağlan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Config Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedIntegration && (
                <>
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedIntegration.color }}
                  >
                    {(() => {
                      const Icon = selectedIntegration.icon;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  {selectedIntegration.name} Entegrasyonu
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Entegrasyon ayarlarını yapılandırın ve bağlantıyı kurun.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Anahtarı</Label>
              <Input id="api-key" type="password" placeholder="sk-xxxx-xxxx-xxxx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret (Opsiyonel)</Label>
              <Input id="api-secret" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                readOnly
                value="https://projektif.app/api/webhooks/callback"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => setIsConfigDialogOpen(false)}>
              Bağlantıyı Kur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


