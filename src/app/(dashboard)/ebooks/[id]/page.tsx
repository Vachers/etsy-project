"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  BookOpen,
  FileText,
  Layers,
  Settings,
  ImageIcon,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Save,
  X,
  Upload,
  Palette,
  Type,
  BookMarked,
  FileType,
  Globe,
  Lock,
  CheckCircle2,
  AlertCircle,
  LayoutTemplate,
  Bookmark,
  ChevronLeft,
  Users,
  MessageSquare,
  Send,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { getMockProductById } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

// Dynamically import TiptapEditor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/components/editor/tiptap-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] border rounded-lg bg-gray-50">
      <div className="animate-pulse text-gray-400">Editör yükleniyor...</div>
    </div>
  ),
});

const statusConfig = {
  active: { label: "Aktif", className: "bg-success-100 text-success-800 border-success-200", icon: CheckCircle2 },
  draft: { label: "Taslak", className: "bg-warning-100 text-warning-800 border-warning-200", icon: AlertCircle },
  selling: { label: "Satışta", className: "bg-secondary-100 text-secondary-800 border-secondary-200", icon: TrendingUp },
  archived: { label: "Arşivlenmiş", className: "bg-gray-100 text-gray-800 border-gray-200", icon: BookMarked },
};

// Mock chapters data
const mockChapters = [
  {
    id: "ch-1",
    title: "Giriş",
    order: 1,
    pages: [
      { id: "p-1-1", title: "Önsöz", content: "<p>Bu kitap...</p>", order: 1 },
      { id: "p-1-2", title: "Kitap Hakkında", content: "<p>Bu bölümde...</p>", order: 2 },
    ],
  },
  {
    id: "ch-2",
    title: "Temel Kavramlar",
    order: 2,
    pages: [
      { id: "p-2-1", title: "React Nedir?", content: "<p>React, Facebook tarafından...</p>", order: 1 },
      { id: "p-2-2", title: "JSX Sözdizimi", content: "<p>JSX, JavaScript için...</p>", order: 2 },
      { id: "p-2-3", title: "Bileşenler", content: "<p>React bileşenleri...</p>", order: 3 },
    ],
  },
  {
    id: "ch-3",
    title: "İleri Düzey Konular",
    order: 3,
    pages: [
      { id: "p-3-1", title: "Hooks", content: "<p>React Hooks...</p>", order: 1 },
      { id: "p-3-2", title: "Context API", content: "<p>Context API...</p>", order: 2 },
    ],
  },
];

export default function EbookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [editorContent, setEditorContent] = useState("<p>Buraya kitabınızın içeriğini yazabilirsiniz...</p>");
  const [currentPageTitle, setCurrentPageTitle] = useState("");
  const [chapters, setChapters] = useState(mockChapters);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isEditingThumbnail, setIsEditingThumbnail] = useState(false);
  const [currentFlipPage, setCurrentFlipPage] = useState(0);
  
  // Content pages state - for managing pages created from İçerik tab
  const [contentPages, setContentPages] = useState<Array<{
    id: string;
    title: string;
    content: string;
    order: number;
    createdAt: Date;
  }>>([]);
  
  // Platform editing state
  const [editingListing, setEditingListing] = useState<{
    id: string;
    price: number;
    currency: string;
    status: string;
    productUrl: string;
    salesCount: number;
  } | null>(null);
  const [isEditingListing, setIsEditingListing] = useState(false);
  
  // Sales entry state
  const [salesEntry, setSalesEntry] = useState({
    listingId: "",
    salesCount: 0,
    grossRevenue: 0,
    salesDate: new Date().toISOString().split("T")[0],
  });
  const [isAddingSales, setIsAddingSales] = useState(false);
  
  // Book settings state
  const [bookSettings, setBookSettings] = useState({
    title: "React ile Modern Web Geliştirme",
    subtitle: "Profesyonel Rehber",
    author: "Kullanıcı",
    language: "tr",
    pageSize: "A5",
    fontSize: "medium",
    fontFamily: "serif",
    lineSpacing: "1.5",
    margins: "normal",
    headerFooter: true,
    pageNumbers: true,
    tableOfContents: true,
    coverStyle: "modern",
    isPublic: false,
  });

  const product = getMockProductById(params.id as string);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Ürün bulunamadı</h2>
        <p className="text-gray-500 mt-2">Bu ID ile eşleşen bir ürün yok.</p>
        <Button onClick={() => router.push("/ebooks")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const status = statusConfig[product.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  // Calculate all pages for flipbook
  const allPages = chapters.flatMap((ch) =>
    ch.pages.map((p) => ({ ...p, chapterTitle: ch.title }))
  );

  const handleThumbnailUpdate = () => {
    if (thumbnailUrl) {
      // In real app, this would call an API
      console.log("Updating thumbnail to:", thumbnailUrl);
      setIsEditingThumbnail(false);
    }
  };

  const addChapter = () => {
    const newChapter = {
      id: `ch-${Date.now()}`,
      title: `Yeni Bölüm ${chapters.length + 1}`,
      order: chapters.length + 1,
      pages: [],
    };
    setChapters([...chapters, newChapter]);
  };

  const addPage = (chapterId: string) => {
    setChapters(
      chapters.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            pages: [
              ...ch.pages,
              {
                id: `p-${Date.now()}`,
                title: `Yeni Sayfa ${ch.pages.length + 1}`,
                content: "",
                order: ch.pages.length + 1,
              },
            ],
          };
        }
        return ch;
      })
    );
  };

  const deleteChapter = (chapterId: string) => {
    setChapters(chapters.filter((ch) => ch.id !== chapterId));
  };

  const deletePage = (chapterId: string, pageId: string) => {
    setChapters(
      chapters.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            pages: ch.pages.filter((p) => p.id !== pageId),
          };
        }
        return ch;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/ebooks")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
              <Badge variant="outline" className={cn("border gap-1 shrink-0", status.className)}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Kaydet
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      {/* Tabs - Modern UI */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-1.5">
          <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 w-full grid grid-cols-7 gap-1 p-1 rounded-lg h-auto">
              <TabsTrigger
                value="info"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Bilgiler</span>
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-secondary-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">İçerik</span>
              </TabsTrigger>
              <TabsTrigger
                value="structure"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Yapı</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Düzenle</span>
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Kitabı Gör</span>
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Ekip</span>
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all
                  data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md
                  data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-white dark:data-[state=inactive]:hover:bg-gray-700"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Mesajlar</span>
              </TabsTrigger>
            </TabsList>
          </div>

        {/* ==================== BİLGİLER TAB ==================== */}
        <TabsContent value="info" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Thumbnail & Info */}
            <div className="space-y-6">
              {/* Thumbnail Card */}
              <Card className="overflow-hidden">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-20 w-20 text-gray-300" />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Dialog open={isEditingThumbnail} onOpenChange={setIsEditingThumbnail}>
                      <DialogTrigger asChild>
                        <Button variant="secondary" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Kapak Değiştir
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Kapak Görseli Güncelle</DialogTitle>
                          <DialogDescription>
                            Yeni bir görsel URL'si girin veya dosya yükleyin
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Görsel URL</Label>
                            <Input
                              value={thumbnailUrl}
                              onChange={(e) => setThumbnailUrl(e.target.value)}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          {thumbnailUrl && (
                            <div className="relative aspect-[3/4] w-40 mx-auto rounded-lg overflow-hidden border">
                              <img
                                src={thumbnailUrl}
                                alt="Önizleme"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditingThumbnail(false)}>
                            İptal
                          </Button>
                          <Button onClick={handleThumbnailUpdate}>Güncelle</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  {/* Timeline Style Dates */}
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 via-primary-300 to-gray-200" />
                    
                    <div className="relative pb-4">
                      <div className="absolute left-[-18px] w-3 h-3 rounded-full bg-primary-500 border-2 border-white shadow" />
                      <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-primary-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wide">Oluşturulma</span>
                          </div>
                          <span className="text-sm font-bold text-primary-700">
                            {new Date(product.createdAt).toLocaleDateString("tr-TR", { 
                              day: 'numeric', month: 'long', year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-[-18px] w-3 h-3 rounded-full bg-secondary-500 border-2 border-white shadow" />
                      <div className="bg-secondary-50 rounded-lg p-3 border border-secondary-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-secondary-600">
                            <Edit className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wide">Güncelleme</span>
                          </div>
                          <span className="text-sm font-bold text-secondary-700">
                            {new Date(product.updatedAt).toLocaleDateString("tr-TR", { 
                              day: 'numeric', month: 'long', year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Enhanced Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Tamamlanma Durumu</p>
                      <Badge className={cn(
                        "text-xs",
                        65 >= 80 ? "bg-secondary-100 text-secondary-700" :
                        65 >= 50 ? "bg-primary-100 text-primary-700" :
                        "bg-warning-100 text-warning-700"
                      )}>
                        %65
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress value={65} className="h-3" />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">Başlangıç</span>
                        <span className="text-[10px] text-gray-400">Tamamlandı</span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-secondary-400" />
                        <span className="text-gray-500">İçerik</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary-400" />
                        <span className="text-gray-500">Platform</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-warning-400" />
                        <span className="text-gray-500">Yapı</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Stats & Platforms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards - Now includes Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary-200 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-secondary-600">Toplam Satış</p>
                        <p className="text-2xl font-bold text-secondary-700">
                          {product.totalSales || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center shrink-0">
                        <DollarSign className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary-600">Toplam Gelir</p>
                        <p className="text-2xl font-bold text-primary-700">
                          {formatCurrency(product.totalRevenue || 0, "USD")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-purple-600">Platformlar</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {product.listings?.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                        <Layers className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-600">Bölüm / Sayfa</p>
                        <p className="text-2xl font-bold text-amber-700">
                          {chapters.length} / {allPages.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Listings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Platform Listeleri</CardTitle>
                    <CardDescription>Ürününüzün satıldığı platformlar</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsAddingSales(true)}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Satış Ekle
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Platform Ekle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {product.listings && product.listings.length > 0 ? (
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Platform</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>Satış</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.listings.map((listing, idx) => (
                            <TableRow key={listing.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div
                                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
                                    style={{ backgroundColor: listing.platform.color }}
                                  >
                                    {listing.platform.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{listing.platform.name}</p>
                                    <p className="text-xs text-gray-500">
                                      %{listing.platform.commissionRate} komisyon
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-lg font-semibold text-secondary-600">
                                  {formatCurrency(Number(listing.price), listing.currency)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">{(idx + 1) * 42}</span>
                                  <span className="text-xs text-gray-500">adet</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "border",
                                    listing.status === "SELLING"
                                      ? "bg-secondary-100 text-secondary-800 border-secondary-200"
                                      : listing.status === "ACTIVE"
                                      ? "bg-success-100 text-success-800 border-success-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  )}
                                >
                                  {listing.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {listing.productUrl ? (
                                  <a
                                    href={listing.productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Görüntüle
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingListing({
                                      id: listing.id,
                                      price: Number(listing.price),
                                      currency: listing.currency,
                                      status: listing.status,
                                      productUrl: listing.productUrl || "",
                                      salesCount: (idx + 1) * 42,
                                    });
                                    setIsEditingListing(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Henüz platform listesi eklenmemiş</p>
                      <Button variant="outline" className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        İlk Platformu Ekle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==================== İÇERİK TAB ==================== */}
        <TabsContent value="content" className="mt-0">
          <Card className="flex flex-col h-[500px] lg:h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between border-b shrink-0 py-3">
              <div className="flex-1 mr-4">
                <Input
                  value={currentPageTitle}
                  onChange={(e) => setCurrentPageTitle(e.target.value)}
                  placeholder="Sayfa başlığını girin..."
                  className="text-lg font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Önizle
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={() => {
                    if (currentPageTitle.trim() && editorContent.trim()) {
                      const newPage = {
                        id: `page-${Date.now()}`,
                        title: currentPageTitle,
                        content: editorContent,
                        order: contentPages.length + 1,
                        createdAt: new Date(),
                      };
                      setContentPages([...contentPages, newPage]);
                      setCurrentPageTitle("");
                      setEditorContent("<p>Yeni sayfa içeriği...</p>");
                    }
                  }}
                >
                  <Save className="h-4 w-4" />
                  Sayfayı Kaydet
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <TiptapEditor
                  content={editorContent}
                  onChange={setEditorContent}
                  placeholder="Kitabınızın içeriğini buraya yazın..."
                />
              </div>
            </CardContent>
            {contentPages.length > 0 && (
              <div className="border-t p-3 bg-gray-50 shrink-0">
                <p className="text-xs text-gray-500 mb-2">Kaydedilen Sayfalar ({contentPages.length})</p>
                <div className="flex flex-wrap gap-2">
                  {contentPages.map((page, index) => (
                    <Badge 
                      key={page.id} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary-100"
                      onClick={() => {
                        setCurrentPageTitle(page.title);
                        setEditorContent(page.content);
                      }}
                    >
                      {index + 1}. {page.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ==================== YAPI TAB ==================== */}
        <TabsContent value="structure" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Content Pages from Editor */}
            {contentPages.length > 0 && (
              <Card className="lg:col-span-3 mb-4">
                <CardHeader className="flex flex-row items-center justify-between border-b py-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary-500" />
                      İçerik Sayfaları
                    </CardTitle>
                    <CardDescription className="text-xs">İçerik editöründen kaydedilen sayfalar</CardDescription>
                  </div>
                  <Badge variant="secondary">{contentPages.length} sayfa</Badge>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {contentPages.map((page, index) => (
                      <div
                        key={page.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => {
                          setActiveTab("content");
                          setCurrentPageTitle(page.title);
                          setEditorContent(page.content);
                        }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{page.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(page.createdAt).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContentPages(contentPages.filter((p) => p.id !== page.id));
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Chapters List */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-base">Bölümler</CardTitle>
                  <CardDescription className="text-xs">{chapters.length} bölüm</CardDescription>
                </div>
                <Button size="sm" onClick={addChapter} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Ekle
                </Button>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {chapters.map((chapter, chapterIndex) => (
                    <Collapsible
                      key={chapter.id}
                      open={selectedChapter === chapter.id}
                      onOpenChange={(open) => setSelectedChapter(open ? chapter.id : null)}
                    >
                      <div className="rounded-lg border bg-white">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 rounded-t-lg">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="flex-1 font-medium text-sm">{chapter.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {chapter.pages.length}
                            </Badge>
                            {selectedChapter === chapter.id ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t px-3 py-2 space-y-1 bg-gray-50">
                            {chapter.pages.map((page) => (
                              <div
                                key={page.id}
                                onClick={() => setSelectedPage(page.id)}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded cursor-pointer text-sm",
                                  selectedPage === page.id
                                    ? "bg-primary-100 text-primary-700"
                                    : "hover:bg-white"
                                )}
                              >
                                <FileText className="h-3 w-3" />
                                <span className="flex-1 truncate">{page.title}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(chapter.id, page.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2 text-xs"
                              onClick={() => addPage(chapter.id)}
                            >
                              <Plus className="h-3 w-3" />
                              Sayfa Ekle
                            </Button>
                          </div>
                          <div className="border-t p-2 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 text-xs"
                              onClick={() => deleteChapter(chapter.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Bölümü Sil
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Page Editor */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b">
                <CardTitle className="text-base">
                  {selectedPage
                    ? chapters.flatMap((c) => c.pages).find((p) => p.id === selectedPage)?.title
                    : "Sayfa Seçin"}
                </CardTitle>
                <CardDescription>
                  {selectedPage
                    ? "Sayfa içeriğini düzenleyin"
                    : "Düzenlemek için sol taraftan bir sayfa seçin"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {selectedPage ? (
                  <TiptapEditor
                    content={
                      chapters.flatMap((c) => c.pages).find((p) => p.id === selectedPage)?.content ||
                      ""
                    }
                    onChange={(content) => {
                      setChapters(
                        chapters.map((ch) => ({
                          ...ch,
                          pages: ch.pages.map((p) =>
                            p.id === selectedPage ? { ...p, content } : p
                          ),
                        }))
                      );
                    }}
                    placeholder="Sayfa içeriğini yazın..."
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <Layers className="h-16 w-16 mb-4" />
                    <p>Düzenlemek için bir sayfa seçin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== DÜZENLE TAB ==================== */}
        <TabsContent value="settings" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  Kitap Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Kitap Başlığı</Label>
                  <Input
                    value={bookSettings.title}
                    onChange={(e) => setBookSettings({ ...bookSettings, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt Başlık</Label>
                  <Input
                    value={bookSettings.subtitle}
                    onChange={(e) => setBookSettings({ ...bookSettings, subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yazar</Label>
                  <Input
                    value={bookSettings.author}
                    onChange={(e) => setBookSettings({ ...bookSettings, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dil</Label>
                  <Select
                    value={bookSettings.language}
                    onValueChange={(value) => setBookSettings({ ...bookSettings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Format Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5" />
                  Format Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sayfa Boyutu</Label>
                    <Select
                      value={bookSettings.pageSize}
                      onValueChange={(value) => setBookSettings({ ...bookSettings, pageSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A5">A5</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Kindle">Kindle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Yazı Boyutu</Label>
                    <Select
                      value={bookSettings.fontSize}
                      onValueChange={(value) => setBookSettings({ ...bookSettings, fontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Küçük</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="large">Büyük</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Yazı Tipi</Label>
                    <Select
                      value={bookSettings.fontFamily}
                      onValueChange={(value) => setBookSettings({ ...bookSettings, fontFamily: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif (Georgia)</SelectItem>
                        <SelectItem value="sans">Sans-serif (Arial)</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Satır Aralığı</Label>
                    <Select
                      value={bookSettings.lineSpacing}
                      onValueChange={(value) => setBookSettings({ ...bookSettings, lineSpacing: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tek</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">Çift</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Seçenekler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sayfa Numaraları</Label>
                    <p className="text-xs text-gray-500">Alt kısımda sayfa numaraları göster</p>
                  </div>
                  <Switch
                    checked={bookSettings.pageNumbers}
                    onCheckedChange={(checked) =>
                      setBookSettings({ ...bookSettings, pageNumbers: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>İçindekiler Tablosu</Label>
                    <p className="text-xs text-gray-500">Otomatik içindekiler oluştur</p>
                  </div>
                  <Switch
                    checked={bookSettings.tableOfContents}
                    onCheckedChange={(checked) =>
                      setBookSettings({ ...bookSettings, tableOfContents: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Üst/Alt Bilgi</Label>
                    <p className="text-xs text-gray-500">Sayfa üst ve alt bilgilerini göster</p>
                  </div>
                  <Switch
                    checked={bookSettings.headerFooter}
                    onCheckedChange={(checked) =>
                      setBookSettings({ ...bookSettings, headerFooter: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Gizlilik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Herkese Açık</Label>
                    <p className="text-xs text-gray-500">Kitabı herkese görünür yap</p>
                  </div>
                  <Switch
                    checked={bookSettings.isPublic}
                    onCheckedChange={(checked) =>
                      setBookSettings({ ...bookSettings, isPublic: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-warning-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-warning-800">Dikkat</p>
                      <p className="text-xs text-warning-600 mt-1">
                        Herkese açık kitaplar arama motorlarında görünebilir.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== KİTABI GÖR TAB ==================== */}
        <TabsContent value="preview" className="mt-0">
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Sayfa Listesi - Sol Panel */}
            <Card className="lg:col-span-1 h-[550px] lg:h-[650px] overflow-hidden flex flex-col">
              <CardHeader className="border-b py-3 shrink-0">
                <CardTitle className="text-sm">Sayfalar</CardTitle>
                <CardDescription className="text-xs">
                  {contentPages.length > 0 ? contentPages.length : allPages.length} sayfa
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 flex-1 overflow-auto">
                <div className="space-y-1">
                  {(contentPages.length > 0 ? contentPages : allPages).map((page, index) => (
                    <div
                      key={page.id || index}
                      onClick={() => setCurrentFlipPage(index)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-all",
                        currentFlipPage === index
                          ? "bg-primary-100 text-primary-700 border border-primary-200"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded text-xs font-medium shrink-0",
                        currentFlipPage === index ? "bg-primary-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      )}>
                        {index + 1}
                      </div>
                      <span className="truncate flex-1">{page.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              {/* Export Buttons */}
              <div className="border-t p-3 shrink-0 space-y-2">
                <p className="text-xs font-medium text-gray-500 mb-2">Dışa Aktar</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <FileType className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    EPUB
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    DOCX
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    HTML
                  </Button>
                </div>
              </div>
            </Card>

            {/* Kitap Önizleme - Sağ Panel (Genişletilmiş) */}
            <Card className="lg:col-span-4 overflow-hidden h-[550px] lg:h-[650px] flex flex-col">
              <CardHeader className="border-b bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{bookSettings.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {bookSettings.subtitle} • {bookSettings.author}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={() => setCurrentFlipPage(Math.max(0, currentFlipPage - 1))}
                      disabled={currentFlipPage === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                      <span className="text-sm font-medium">
                        {currentFlipPage + 1}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-sm text-gray-400">
                        {contentPages.length > 0 ? contentPages.length : allPages.length || 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={() =>
                        setCurrentFlipPage(Math.min((contentPages.length > 0 ? contentPages.length : allPages.length) - 1, currentFlipPage + 1))
                      }
                      disabled={currentFlipPage >= (contentPages.length > 0 ? contentPages.length : allPages.length) - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex-1 flex items-center justify-center relative overflow-auto">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* Flipbook Style Preview - Büyütülmüş */}
                <div className="relative py-6">
                  {/* Book Shadow */}
                  <div className="absolute inset-x-12 bottom-0 h-10 bg-black/20 blur-xl rounded-full" />
                  
                  <div
                    className="relative bg-white dark:bg-gray-100 rounded-r-lg shadow-2xl transition-all duration-500 ease-out"
                    style={{
                      width: "min(700px, 85vw)",
                      minHeight: "min(800px, calc(100vh - 280px))",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), -10px 0 20px -5px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Book Spine Effect */}
                    <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-gray-400 via-gray-200 to-transparent rounded-l" />
                    
                    {/* Page Stack Effect */}
                    <div className="absolute -left-1 top-2 bottom-2 w-1 bg-gray-300 rounded-l" />
                    <div className="absolute -left-2 top-4 bottom-4 w-1 bg-gray-200 rounded-l" />
                    <div className="absolute -left-3 top-6 bottom-6 w-1 bg-gray-100 rounded-l" />
                    
                    {/* Page Content */}
                    <div className="p-10 pl-14 prose prose-lg max-w-none overflow-auto" style={{ minHeight: "min(750px, calc(100vh - 320px))" }}>
                      {(() => {
                        const pages = contentPages.length > 0 ? contentPages : allPages;
                        const currentPage = pages[currentFlipPage];
                        
                        if (currentPage) {
                          return (
                            <>
                              {'chapterTitle' in currentPage && currentPage.chapterTitle && (
                                <div className="text-sm text-primary-500 uppercase tracking-widest mb-3 font-medium">
                                  {currentPage.chapterTitle}
                                </div>
                              )}
                              <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                                {currentPage.title}
                              </h2>
                              <div
                                className="text-gray-700 leading-relaxed text-base"
                                dangerouslySetInnerHTML={{
                                  __html: currentPage.content || "<p class='text-gray-400 italic'>Bu sayfa henüz içerik eklenmemiş.</p>",
                                }}
                              />
                            </>
                          );
                        } else {
                          return (
                            <div className="flex flex-col items-center justify-center h-[500px] text-gray-400">
                              <div className="p-8 rounded-full bg-gray-100 mb-6">
                                <BookOpen className="h-16 w-16" />
                              </div>
                              <p className="text-xl font-medium">Henüz sayfa eklenmemiş</p>
                              <p className="text-base mt-2">İçerik sekmesinden sayfa ekleyebilirsiniz</p>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Page Number */}
                    {bookSettings.pageNumbers && (
                      <div className="absolute bottom-6 left-0 right-0 text-center">
                        <span className="text-sm text-gray-400 bg-white px-4 py-1.5 rounded-full border shadow-sm">
                          Sayfa {currentFlipPage + 1}
                        </span>
                      </div>
                    )}

                    {/* Page curl effect */}
                    <div className="absolute bottom-0 right-0 w-16 h-16">
                      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-gray-200 via-gray-100 to-transparent rounded-tl-3xl" />
                      <div className="absolute bottom-1 right-1 w-10 h-10 bg-gradient-to-tl from-gray-300 to-transparent rounded-tl-2xl opacity-50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== EKİP TAB ==================== */}
        <TabsContent value="team" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Ekip Üyeleri Listesi */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ekip Üyeleri</CardTitle>
                  <CardDescription>Bu ürüne atanan ekip üyeleri</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Üye Ekle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Mock team members */}
                  {[
                    { id: "1", name: "Ahmet Yılmaz", role: "İçerik Yazarı", avatar: "AY" },
                    { id: "2", name: "Zeynep Kaya", role: "Editör", avatar: "ZK" },
                    { id: "3", name: "Mehmet Demir", role: "Tasarımcı", avatar: "MD" },
                  ].map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50">
                      <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                {/* Empty state */}
                {false && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Henüz üye eklenmemiş</h3>
                    <p className="text-sm text-gray-500 mt-1">Ekip üyesi ekleyerek işbirliğine başlayın</p>
                    <Button className="mt-4 gap-2">
                      <UserPlus className="h-4 w-4" />
                      İlk Üyeyi Ekle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aktivite Log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Son Aktiviteler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: "Ahmet Yılmaz", action: "içerik ekledi", time: "2 saat önce" },
                    { user: "Zeynep Kaya", action: "sayfa düzenledi", time: "5 saat önce" },
                    { user: "Mehmet Demir", action: "kapak güncelledi", time: "1 gün önce" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">
                        {log.user.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="dark:text-gray-200">
                          <span className="font-medium">{log.user}</span>{" "}
                          <span className="text-gray-500 dark:text-gray-400">{log.action}</span>
                        </p>
                        <p className="text-xs text-gray-400">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== MESAJLAR TAB ==================== */}
        <TabsContent value="messages" className="mt-0">
          <Card className="h-[500px] lg:h-[600px] flex flex-col">
            <CardHeader className="border-b shrink-0">
              <CardTitle>Ekip Sohbeti</CardTitle>
              <CardDescription>Ekip üyeleriyle bu ürün hakkında mesajlaşın</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Mock messages */}
              {[
                { id: "1", sender: "Ahmet Yılmaz", content: "Merhaba, 3. bölümün içeriğini tamamladım.", time: "14:30", isMe: false },
                { id: "2", sender: "Siz", content: "Harika! Teşekkürler. Editör incelemesine gönderebilir misin?", time: "14:35", isMe: true },
                { id: "3", sender: "Zeynep Kaya", content: "Ben de kapak tasarımı için birkaç öneri hazırladım.", time: "15:00", isMe: false },
                { id: "4", sender: "Siz", content: "Süper! Yarın toplantıda inceleyelim.", time: "15:05", isMe: true },
              ].map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    message.isMe ? "justify-end" : "justify-start"
                  )}
                >
                  {!message.isMe && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold shrink-0">
                      {message.sender.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] p-3 rounded-2xl",
                      message.isMe
                        ? "bg-primary-500 text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                    )}
                  >
                    {!message.isMe && (
                      <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1 text-right",
                      message.isMe ? "text-white/70" : "text-gray-400"
                    )}>
                      {message.time}
                    </p>
                  </div>
                  {message.isMe && (
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-semibold shrink-0">
                      S
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            <div className="border-t p-4 flex items-center gap-2 shrink-0">
              <Input
                placeholder="Mesajınızı yazın..."
                className="flex-1"
              />
              <Button className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Platform Listing Edit Dialog */}
      <Dialog open={isEditingListing} onOpenChange={setIsEditingListing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Platform Listesi Düzenle</DialogTitle>
            <DialogDescription>
              Platform bilgilerini ve satış verilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          {editingListing && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fiyat</Label>
                  <Input
                    type="number"
                    value={editingListing.price}
                    onChange={(e) => setEditingListing({
                      ...editingListing,
                      price: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Para Birimi</Label>
                  <Select
                    value={editingListing.currency}
                    onValueChange={(value) => setEditingListing({
                      ...editingListing,
                      currency: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="TRY">TRY (₺)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Durum</Label>
                <Select
                  value={editingListing.status}
                  onValueChange={(value) => setEditingListing({
                    ...editingListing,
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SELLING">Satışta</SelectItem>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="DRAFT">Taslak</SelectItem>
                    <SelectItem value="PAUSED">Duraklatıldı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ürün Linki</Label>
                <Input
                  value={editingListing.productUrl}
                  onChange={(e) => setEditingListing({
                    ...editingListing,
                    productUrl: e.target.value
                  })}
                  placeholder="https://..."
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Satış Miktarı</Label>
                <Input
                  type="number"
                  value={editingListing.salesCount}
                  onChange={(e) => setEditingListing({
                    ...editingListing,
                    salesCount: parseInt(e.target.value) || 0
                  })}
                />
                <p className="text-xs text-gray-500">Bu platformdaki toplam satış adedi</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingListing(false)}>
              İptal
            </Button>
            <Button onClick={() => {
              console.log("Saving listing:", editingListing);
              setIsEditingListing(false);
            }}>
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sales Entry Dialog */}
      <Dialog open={isAddingSales} onOpenChange={setIsAddingSales}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Satış Verisi Ekle</DialogTitle>
            <DialogDescription>
              Belirli bir dönem için satış verisini girin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={salesEntry.listingId}
                onValueChange={(value) => setSalesEntry({
                  ...salesEntry,
                  listingId: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Platform seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {product.listings?.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Satış Tarihi</Label>
              <Input
                type="date"
                value={salesEntry.salesDate}
                onChange={(e) => setSalesEntry({
                  ...salesEntry,
                  salesDate: e.target.value
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Satış Adedi</Label>
                <Input
                  type="number"
                  value={salesEntry.salesCount}
                  onChange={(e) => setSalesEntry({
                    ...salesEntry,
                    salesCount: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Brüt Gelir</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={salesEntry.grossRevenue}
                  onChange={(e) => setSalesEntry({
                    ...salesEntry,
                    grossRevenue: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingSales(false)}>
              İptal
            </Button>
            <Button onClick={() => {
              console.log("Adding sales:", salesEntry);
              setIsAddingSales(false);
              setSalesEntry({
                listingId: "",
                salesCount: 0,
                grossRevenue: 0,
                salesDate: new Date().toISOString().split("T")[0],
              });
            }}>
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
