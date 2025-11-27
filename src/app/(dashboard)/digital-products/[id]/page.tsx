"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Package, 
  ArrowLeft, 
  Edit, 
  MoreVertical, 
  ExternalLink,
  Calendar,
  DollarSign,
  ShoppingCart,
  Store,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Layers,
  FolderOpen,
  ClipboardList,
  Tags,
  Download,
  Copy,
  Check,
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  Eye,
  Star,
  Save,
  Loader2,
  ZoomIn,
  Info,
  Target,
  Award,
  BarChart3,
  Palette,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMockProductById } from "@/lib/mock-data";
import { aiPlatforms, mockupCategories, mockupSources } from "@/lib/platforms";

// Pre-Sale Yapılacaklar Listesi (Zorluk derecesi ile)
const PRE_SALE_TASKS = [
  { id: "product_name", text: "Ürün ismi", difficulty: 1, order: 1, icon: "📝" },
  { id: "concept", text: "Konsept", difficulty: 2, order: 2, icon: "💡" },
  { id: "prompts", text: "Promptlar", difficulty: 3, order: 3, icon: "✨" },
  { id: "mockup", text: "Mockup", difficulty: 2, order: 4, icon: "🖼️" },
  { id: "images", text: "Resimler", difficulty: 3, order: 5, icon: "📸" },
  { id: "mockup_production", text: "Mockup-resim üretimi", difficulty: 4, order: 6, icon: "🎨" },
  { id: "tag_research", text: "Etiket Araştırması", difficulty: 2, order: 7, icon: "🏷️" },
  { id: "competitor_analysis", text: "Rakip Analizi", difficulty: 3, order: 8, icon: "🔍" },
  { id: "seo", text: "SEO", difficulty: 2, order: 9, icon: "📊" },
  { id: "description", text: "Açıklama", difficulty: 2, order: 10, icon: "📄" },
];

const TOTAL_DIFFICULTY = PRE_SALE_TASKS.reduce((sum, task) => sum + task.difficulty, 0);

// Mock data
const initialPictures = [
  { id: "1", title: "Ana Görsel", imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", aiPlatform: "MIDJOURNEY", modelVersion: "v6", promptId: "1", isSelected: true, isMainImage: true, createdAt: "2024-01-15" },
  { id: "2", title: "Alternatif 1", imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400", aiPlatform: "FLUX", modelVersion: "Flux Pro", promptId: "2", isSelected: true, isMainImage: false, createdAt: "2024-01-16" },
  { id: "3", title: "Alternatif 2", imageUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400", aiPlatform: "DALLE", modelVersion: "DALL-E 3", promptId: "1", isSelected: false, isMainImage: false, createdAt: "2024-01-17" },
  { id: "4", title: "Arka Plan", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400", aiPlatform: "STABLE_DIFFUSION", modelVersion: "SDXL", promptId: "2", isSelected: true, isMainImage: false, createdAt: "2024-01-18" },
];

const initialMockups = [
  { id: "1", title: "T-Shirt Mockup", mockupUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", source: "PLACEIT", category: "TSHIRT", isSelected: true, createdAt: "2024-01-17" },
  { id: "2", title: "Poster Frame", mockupUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", source: "CANVA", category: "POSTER", isSelected: true, createdAt: "2024-01-18" },
  { id: "3", title: "Mug Mockup", mockupUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400", source: "PLACEIT", category: "MUG", isSelected: false, createdAt: "2024-01-19" },
];

const initialPrompts = [
  { id: "1", title: "Ana Görsel Prompt", content: "A beautiful digital art illustration...", model: "MIDJOURNEY", modelVersion: "v6", createdAt: "2024-01-15" },
  { id: "2", title: "Arka Plan Prompt", content: "Abstract geometric background...", model: "FLUX", modelVersion: "Flux Pro", createdAt: "2024-01-16" },
];

const initialFiles = [
  { id: "1", fileName: "main_design.psd", filePath: "/designs/main_design.psd", fileType: "PSD", fileSize: "125 MB", conceptNotes: "Ana tasarım dosyası" },
  { id: "2", fileName: "export_bundle.zip", filePath: "/exports/bundle.zip", fileType: "ZIP", fileSize: "45 MB", conceptNotes: "Export dosyaları" },
];

const initialPlatformSales = [
  { platformId: "etsy", platformName: "Etsy", color: "#f56400", salesCount: 45, revenue: 450, price: 9.99, lastSale: "2024-01-20" },
  { platformId: "gumroad", platformName: "Gumroad", color: "#ff90e8", salesCount: 12, revenue: 120, price: 9.99, lastSale: "2024-01-18" },
];

const initialSaleInfo = {
  seoTitle: "Modern Minimalist Logo Template | Editable Canva Template | Business Branding Kit",
  seoDescription: "Professional and modern minimalist logo template...",
  tags: ["logo template", "minimalist design", "business logo", "canva template", "branding kit", "small business", "startup logo", "modern logo", "editable template", "instant download", "digital download", "professional logo", "brand identity"],
  category: "Digital Prints",
  subcategory: "Graphic Design Templates",
  sku: "MLT-001",
  stockQuantity: 999,
  processingTime: "Instant Download",
};

interface PictureItem {
  id: string;
  title: string;
  imageUrl: string;
  aiPlatform: string;
  modelVersion: string;
  promptId?: string;
  isSelected: boolean;
  isMainImage: boolean;
  createdAt: string;
}

interface MockupItem {
  id: string;
  title: string;
  mockupUrl: string;
  source: string;
  category: string;
  isSelected: boolean;
  createdAt: string;
}

export default function DigitalProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Dialog states
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [pictureDialogOpen, setPictureDialogOpen] = useState(false);
  const [mockupDialogOpen, setMockupDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [editPlatformDialogOpen, setEditPlatformDialogOpen] = useState(false);
  const [imagePreviewDialogOpen, setImagePreviewDialogOpen] = useState(false);
  const [mockupPreviewDialogOpen, setMockupPreviewDialogOpen] = useState(false);

  // Preview states
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<PictureItem | null>(null);
  const [selectedPreviewMockup, setSelectedPreviewMockup] = useState<MockupItem | null>(null);

  // Multi-add states
  const [bulkPrompts, setBulkPrompts] = useState([{ id: "1", content: "", model: "", modelVersion: "" }]);
  const [bulkPictures, setBulkPictures] = useState([{ id: "1", imageUrl: "", aiPlatform: "", modelVersion: "", promptId: "" }]);
  const [bulkMockups, setBulkMockups] = useState([{ id: "1", mockupUrl: "", source: "", category: "" }]);
  const [globalModel, setGlobalModel] = useState("");
  const [globalModelVersion, setGlobalModelVersion] = useState("");

  // Data states
  const [prompts, setPrompts] = useState(initialPrompts);
  const [pictures, setPictures] = useState<PictureItem[]>(initialPictures);
  const [mockups, setMockups] = useState<MockupItem[]>(initialMockups);
  const [files, setFiles] = useState(initialFiles);
  const [saleInfo, setSaleInfo] = useState(initialSaleInfo);
  const [platformSales, setPlatformSales] = useState(initialPlatformSales);
  const [completedTasks, setCompletedTasks] = useState<string[]>(["product_name", "concept", "prompts"]);
  const [preSaleNotes, setPreSaleNotes] = useState("Tasarım aşaması tamamlandı.");

  // Edit states
  const [editingPlatform, setEditingPlatform] = useState<typeof initialPlatformSales[0] | null>(null);
  const [newSalesAmount, setNewSalesAmount] = useState({ platformId: "", salesCount: 0, revenue: 0 });
  const [newFile, setNewFile] = useState({ fileName: "", filePath: "", fileType: "", fileSize: "", conceptNotes: "" });

  const product = getMockProductById(params.id as string);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Ürün bulunamadı</h2>
        <p className="text-gray-500 mt-2">Bu ID ile eşleşen bir ürün yok.</p>
        <Button onClick={() => router.push("/digital-products")} className="mt-4">Geri Dön</Button>
      </div>
    );
  }

  // Calculate progress
  const calculateProgress = () => {
    const completedDifficulty = PRE_SALE_TASKS.filter(task => completedTasks.includes(task.id)).reduce((sum, task) => sum + task.difficulty, 0);
    return Math.round((completedDifficulty / TOTAL_DIFFICULTY) * 100);
  };

  const progressValue = calculateProgress();
  const getProgressColor = () => {
    if (progressValue < 30) return "bg-red-500";
    if (progressValue < 60) return "bg-amber-500";
    if (progressValue < 90) return "bg-blue-500";
    return "bg-emerald-500";
  };

  // Image selection handlers
  const toggleImageSelection = (id: string) => {
    setPictures(prev => prev.map(p => p.id === id ? { ...p, isSelected: !p.isSelected } : p));
  };

  const setMainImage = (id: string) => {
    setPictures(prev => prev.map(p => ({ ...p, isMainImage: p.id === id })));
  };

  const toggleMockupSelection = (id: string) => {
    setMockups(prev => prev.map(m => m.id === id ? { ...m, isSelected: !m.isSelected } : m));
  };

  // Image preview
  const openImagePreview = (picture: PictureItem) => {
    setSelectedPreviewImage(picture);
    setImagePreviewDialogOpen(true);
  };

  const openMockupPreview = (mockup: MockupItem) => {
    setSelectedPreviewMockup(mockup);
    setMockupPreviewDialogOpen(true);
  };

  // Helper functions
  const getAIPlatformColor = (platformId: string) => aiPlatforms.find(p => p.id === platformId)?.color || "#6B7280";
  const getAIPlatformName = (platformId: string) => aiPlatforms.find(p => p.id === platformId)?.name || platformId;
  const copyTag = (tag: string) => { navigator.clipboard.writeText(tag); setCopiedTag(tag); setTimeout(() => setCopiedTag(null), 2000); };
  const copyAllTags = () => { navigator.clipboard.writeText(saleInfo.tags.join(", ")); setCopiedTag("all"); setTimeout(() => setCopiedTag(null), 2000); };

  // Bulk handlers
  const applyGlobalModel = () => { if (globalModel) setBulkPrompts(prev => prev.map(p => ({ ...p, model: globalModel, modelVersion: globalModelVersion }))); };
  const applyGlobalModelToPictures = () => { if (globalModel) setBulkPictures(prev => prev.map(p => ({ ...p, aiPlatform: globalModel, modelVersion: globalModelVersion }))); };
  const addPromptRow = () => setBulkPrompts(prev => [...prev, { id: Date.now().toString(), content: "", model: globalModel, modelVersion: globalModelVersion }]);
  const removePromptRow = (id: string) => { if (bulkPrompts.length > 1) setBulkPrompts(prev => prev.filter(p => p.id !== id)); };
  const addPictureRow = () => setBulkPictures(prev => [...prev, { id: Date.now().toString(), imageUrl: "", aiPlatform: globalModel, modelVersion: globalModelVersion, promptId: "" }]);
  const removePictureRow = (id: string) => { if (bulkPictures.length > 1) setBulkPictures(prev => prev.filter(p => p.id !== id)); };
  const addMockupRow = () => setBulkMockups(prev => [...prev, { id: Date.now().toString(), mockupUrl: "", source: "", category: "" }]);
  const removeMockupRow = (id: string) => { if (bulkMockups.length > 1) setBulkMockups(prev => prev.filter(m => m.id !== id)); };

  // Save handlers
  const saveBulkPrompts = () => {
    const validPrompts = bulkPrompts.filter(p => p.content.trim());
    if (!validPrompts.length) return;
    const newPrompts = validPrompts.map(p => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: p.content.substring(0, 30) + "...",
      content: p.content,
      model: p.model,
      modelVersion: p.modelVersion,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    setPrompts(prev => [...prev, ...newPrompts]);
    setPromptDialogOpen(false);
    setBulkPrompts([{ id: "1", content: "", model: "", modelVersion: "" }]);
  };

  const saveBulkPictures = () => {
    const validPictures = bulkPictures.filter(p => p.imageUrl.trim());
    if (!validPictures.length) return;
    const newPictures = validPictures.map((p, i) => ({
      id: Date.now().toString() + i,
      title: "Görsel " + (pictures.length + i + 1),
      imageUrl: p.imageUrl,
      aiPlatform: p.aiPlatform,
      modelVersion: p.modelVersion,
      promptId: p.promptId,
      isSelected: false,
      isMainImage: false,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    setPictures(prev => [...prev, ...newPictures]);
    setPictureDialogOpen(false);
    setBulkPictures([{ id: "1", imageUrl: "", aiPlatform: "", modelVersion: "", promptId: "" }]);
  };

  const saveBulkMockups = () => {
    const validMockups = bulkMockups.filter(m => m.mockupUrl.trim());
    if (!validMockups.length) return;
    const newMockups = validMockups.map((m, i) => ({
      id: Date.now().toString() + i,
      title: "Mockup " + (mockups.length + i + 1),
      mockupUrl: m.mockupUrl,
      source: m.source,
      category: m.category,
      isSelected: false,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    setMockups(prev => [...prev, ...newMockups]);
    setMockupDialogOpen(false);
    setBulkMockups([{ id: "1", mockupUrl: "", source: "", category: "" }]);
  };

  // Platform handlers
  const handleEditPlatform = (platform: typeof initialPlatformSales[0]) => {
    setEditingPlatform(platform);
    setNewSalesAmount({ platformId: platform.platformId, salesCount: platform.salesCount, revenue: platform.revenue });
    setEditPlatformDialogOpen(true);
  };

  const saveEditPlatform = () => {
    if (!editingPlatform) return;
    setPlatformSales(prev => prev.map(p => p.platformId === editingPlatform.platformId ? { ...p, salesCount: newSalesAmount.salesCount, revenue: newSalesAmount.revenue, lastSale: new Date().toISOString().split('T')[0] } : p));
    setEditPlatformDialogOpen(false);
    setEditingPlatform(null);
  };

  const addNewPlatformSales = () => {
    if (!newSalesAmount.platformId) return;
    const existing = platformSales.find(p => p.platformId === newSalesAmount.platformId);
    if (existing) {
      setPlatformSales(prev => prev.map(p => p.platformId === newSalesAmount.platformId ? { ...p, salesCount: p.salesCount + newSalesAmount.salesCount, revenue: p.revenue + newSalesAmount.revenue, lastSale: new Date().toISOString().split('T')[0] } : p));
    } else {
      setPlatformSales(prev => [...prev, { platformId: newSalesAmount.platformId, platformName: newSalesAmount.platformId.charAt(0).toUpperCase() + newSalesAmount.platformId.slice(1), color: "#2563eb", salesCount: newSalesAmount.salesCount, revenue: newSalesAmount.revenue, price: 9.99, lastSale: new Date().toISOString().split('T')[0] }]);
    }
    setSalesDialogOpen(false);
    setNewSalesAmount({ platformId: "", salesCount: 0, revenue: 0 });
  };

  const selectedImages = pictures.filter(p => p.isSelected);
  const selectedMockups = mockups.filter(m => m.isSelected);
  const mainImage = pictures.find(p => p.isMainImage);
  const totalRevenue = platformSales.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = platformSales.reduce((sum, p) => sum + p.salesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/digital-products")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-4">
            {product.thumbnail && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-100 shadow-sm">
                <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200">Satışta</Badge>
              </div>
              <p className="text-gray-500 mt-1 max-w-xl">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={() => router.push(`/digital-products/${params.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Kopyala</DropdownMenuItem>
              <DropdownMenuItem><ExternalLink className="h-4 w-4 mr-2" />Önizleme</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Sil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-gray-100/80 p-1 h-auto flex-wrap gap-1">
          {[
            { value: "info", label: "Bilgiler", icon: Package },
            { value: "prompts", label: "Prompts", icon: Sparkles },
            { value: "pictures", label: "Pictures", icon: ImageIcon },
            { value: "mockups", label: "Mock-ups", icon: Layers },
            { value: "files", label: "Files", icon: FolderOpen },
            { value: "presale", label: "Pre-Sale", icon: ClipboardList },
            { value: "sale", label: "Sale", icon: Tags },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm px-4 py-2 rounded-md transition-all">
              <tab.icon className="h-4 w-4 mr-2" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Info Tab - Professional E-Book Style */}
        <TabsContent value="info" className="mt-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">${totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />+12% bu ay</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Toplam Satış</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{totalSales}</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1"><ShoppingCart className="h-3 w-3" />Son 30 gün</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Platformlar</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">{platformSales.length}</p>
                    <p className="text-xs text-purple-600 mt-1 flex items-center gap-1"><Store className="h-3 w-3" />Aktif satış</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Store className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">İlerleme</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">%{progressValue}</p>
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Target className="h-3 w-3" />Hazırlık</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Platform Sales - Takes 2 columns */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5 text-primary-500" />
                    Platform Satışları
                  </CardTitle>
                  <CardDescription>Platformlardaki satış performansınız</CardDescription>
                </div>
                <Button size="sm" onClick={() => setSalesDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />Satış Ekle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformSales.map((platform) => (
                    <div key={platform.platformId} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: platform.color }}>
                        {platform.platformName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{platform.platformName}</h4>
                          <Badge variant="outline" className="ml-2">${platform.price}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{platform.salesCount} satış</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{platform.lastSale}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">${platform.revenue}</p>
                        <p className="text-xs text-gray-500">toplam gelir</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEditPlatform(platform)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-primary-500" />
                  Hızlı Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">Oluşturulma</span>
                  <span className="text-sm font-medium">15 Oca 2024</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">Son Güncelleme</span>
                  <span className="text-sm font-medium">20 Şub 2024</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">Görsel Sayısı</span>
                  <span className="text-sm font-medium">{pictures.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">Mockup Sayısı</span>
                  <span className="text-sm font-medium">{mockups.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">Dosya Sayısı</span>
                  <span className="text-sm font-medium">{files.length}</span>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Hazırlık Durumu</span>
                    <span className="text-sm font-medium text-primary-600">%{progressValue}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${getProgressColor()} transition-all`} style={{ width: `${progressValue}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary-500" />Promptlar</CardTitle>
              <Button size="sm" onClick={() => setPromptDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Prompt Ekle</Button>
            </CardHeader>
            <CardContent>
              {prompts.length > 0 ? (
                <div className="space-y-4">
                  {prompts.map((prompt) => (
                    <div key={prompt.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{prompt.title}</h4>
                        {prompt.model && (
                          <Badge variant="outline" style={{ borderColor: getAIPlatformColor(prompt.model), color: getAIPlatformColor(prompt.model) }}>
                            {getAIPlatformName(prompt.model)} {prompt.modelVersion}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md font-mono">{prompt.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">{prompt.createdAt}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(prompt.content)}><Copy className="h-3 w-3 mr-1" />Kopyala</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setPrompts(prev => prev.filter(p => p.id !== prompt.id))}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500"><Sparkles className="h-12 w-12 mx-auto mb-2 text-gray-300" /><p>Henüz prompt eklenmemiş</p></div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pictures Tab with Selection */}
        <TabsContent value="pictures" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary-500" />Ham Görseller</CardTitle>
                <CardDescription>Seçilen görseller satış ilanında kullanılacak. Tıklayarak seçin.</CardDescription>
              </div>
              <Button size="sm" onClick={() => setPictureDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Görsel Ekle</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pictures.map((picture) => (
                  <div key={picture.id} className={`relative group border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${picture.isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'}`}>
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${picture.isSelected ? 'bg-primary-500 border-primary-500' : 'bg-white/80 border-gray-300'}`} onClick={(e) => { e.stopPropagation(); toggleImageSelection(picture.id); }}>
                        {picture.isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                    {/* Main Image Badge */}
                    {picture.isMainImage && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-amber-500 text-white"><Star className="h-3 w-3 mr-1" />Ana</Badge>
                      </div>
                    )}
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 relative" onClick={() => openImagePreview(picture)}>
                      <Image src={picture.imageUrl} alt={picture.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="icon" variant="secondary" className="h-10 w-10"><ZoomIn className="h-5 w-5" /></Button>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-3 bg-white">
                      <p className="text-sm font-medium truncate">{picture.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAIPlatformColor(picture.aiPlatform) }} />
                        <span className="text-xs text-gray-500">{getAIPlatformName(picture.aiPlatform)}</span>
                      </div>
                      {picture.isSelected && !picture.isMainImage && (
                        <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setMainImage(picture.id)}>
                          <Star className="h-3 w-3 mr-1" />Ana Görsel Yap
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mockups Tab with Selection */}
        <TabsContent value="mockups" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary-500" />Mockuplar</CardTitle>
                <CardDescription>Seçilen mockup'lar satış ilanında kullanılacak.</CardDescription>
              </div>
              <Button size="sm" onClick={() => setMockupDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Mockup Ekle</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockups.map((mockup) => (
                  <div key={mockup.id} className={`relative group border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${mockup.isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${mockup.isSelected ? 'bg-primary-500 border-primary-500' : 'bg-white/80 border-gray-300'}`} onClick={(e) => { e.stopPropagation(); toggleMockupSelection(mockup.id); }}>
                        {mockup.isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                    <div className="aspect-video bg-gray-100 relative" onClick={() => openMockupPreview(mockup)}>
                      <Image src={mockup.mockupUrl} alt={mockup.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="icon" variant="secondary" className="h-10 w-10"><ZoomIn className="h-5 w-5" /></Button>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <p className="font-medium">{mockup.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{mockup.source}</Badge>
                        <Badge variant="secondary" className="text-xs">{mockupCategories.find(c => c.id === mockup.category)?.icon} {mockupCategories.find(c => c.id === mockup.category)?.name}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5 text-primary-500" />Dosyalar</CardTitle>
              <Button size="sm" onClick={() => setFileDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Dosya Ekle</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">{file.fileType}</div>
                      <div>
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-gray-500">{file.fileSize} • {file.filePath}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pre-Sale Tab with Professional Progress */}
        <TabsContent value="presale" className="mt-6 space-y-6">
          {/* Progress Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="h-6 w-6 text-primary-500" />
                    İlerleme Durumu
                  </CardTitle>
                  <CardDescription>Zorluk derecesine göre ağırlıklı hesaplama</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">%{progressValue}</p>
                  <p className="text-sm text-gray-500">{completedTasks.length}/{PRE_SALE_TASKS.length} görev</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div className={`absolute inset-y-0 left-0 ${getProgressColor()} transition-all duration-500 rounded-full`} style={{ width: `${progressValue}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Başlangıç</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Devam Ediyor</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Son Aşama</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Tamamlandı</span>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Yapılacaklar Listesi</CardTitle>
              <CardDescription>Görevleri tamamlandıkça işaretleyin. Zorluk derecesine göre ilerleme hesaplanır.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {PRE_SALE_TASKS.map((task) => {
                  const isCompleted = completedTasks.includes(task.id);
                  return (
                    <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100 hover:border-gray-200'}`} onClick={() => {
                      if (isCompleted) setCompletedTasks(prev => prev.filter(id => id !== task.id));
                      else setCompletedTasks(prev => [...prev, task.id]);
                    }}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {isCompleted ? <Check className="h-5 w-5" /> : <span className="text-lg">{task.icon}</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>{task.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {[...Array(task.difficulty)].map((_, i) => (
                            <div key={i} className={`h-1.5 w-4 rounded-full ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">Zorluk: {task.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle>Notlar</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={preSaleNotes} onChange={(e) => setPreSaleNotes(e.target.value)} rows={4} placeholder="Satış öncesi süreç notları..." />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sale Tab with Selected Images */}
        <TabsContent value="sale" className="mt-6 space-y-6">
          {/* Selected Listing Images */}
          {selectedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary-500" />İlan Görselleri</CardTitle>
                <CardDescription>Pictures sekmesinde seçilen görseller burada listelenir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {selectedImages.map((img, idx) => (
                    <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden border-2 ${img.isMainImage ? 'border-amber-400 ring-2 ring-amber-200' : 'border-gray-200'}`}>
                      <Image src={img.imageUrl} alt={img.title} fill className="object-cover" />
                      {img.isMainImage && (
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-amber-500 text-white text-xs"><Star className="h-2 w-2" /></Badge>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 rounded">{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Mockups */}
          {selectedMockups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary-500" />İlan Mockup'ları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedMockups.map((m) => (
                    <div key={m.id} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image src={m.mockupUrl} alt={m.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Tags className="h-5 w-5 text-primary-500" />SEO Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO Başlığı (140 karakter)</Label>
                <Input value={saleInfo.seoTitle} onChange={(e) => setSaleInfo(prev => ({ ...prev, seoTitle: e.target.value }))} maxLength={140} />
                <p className="text-xs text-gray-500 text-right">{saleInfo.seoTitle.length}/140</p>
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea value={saleInfo.seoDescription} onChange={(e) => setSaleInfo(prev => ({ ...prev, seoDescription: e.target.value }))} rows={6} />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Etiketler</CardTitle><CardDescription>Etsy maksimum 13 etiket destekler</CardDescription></div>
              <Button variant="outline" size="sm" onClick={copyAllTags}>{copiedTag === "all" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}Tümünü Kopyala</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {saleInfo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary-100 transition-colors group" onClick={() => copyTag(tag)}>
                    {copiedTag === tag ? <Check className="h-3 w-3 mr-1" /> : null}
                    {tag}
                    <X className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); setSaleInfo(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) })); }} />
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">{saleInfo.tags.length}/13 etiket</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewDialogOpen} onOpenChange={setImagePreviewDialogOpen}>
        <DialogContent className="bg-white max-w-4xl">
          {selectedPreviewImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPreviewImage.title}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image src={selectedPreviewImage.imageUrl} alt={selectedPreviewImage.title} fill className="object-contain" />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-500">AI Platform</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAIPlatformColor(selectedPreviewImage.aiPlatform) }} />
                      <span className="font-medium">{getAIPlatformName(selectedPreviewImage.aiPlatform)}</span>
                      <Badge variant="outline">{selectedPreviewImage.modelVersion}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Oluşturulma Tarihi</Label>
                    <p className="font-medium mt-1">{selectedPreviewImage.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Durum</Label>
                    <div className="flex gap-2 mt-1">
                      {selectedPreviewImage.isSelected && <Badge className="bg-primary-100 text-primary-700">Seçili</Badge>}
                      {selectedPreviewImage.isMainImage && <Badge className="bg-amber-100 text-amber-700">Ana Görsel</Badge>}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => { toggleImageSelection(selectedPreviewImage.id); setSelectedPreviewImage(prev => prev ? { ...prev, isSelected: !prev.isSelected } : null); }}>
                      {selectedPreviewImage.isSelected ? 'Seçimi Kaldır' : 'Seç'}
                    </Button>
                    {selectedPreviewImage.isSelected && !selectedPreviewImage.isMainImage && (
                      <Button className="flex-1" onClick={() => { setMainImage(selectedPreviewImage.id); setSelectedPreviewImage(prev => prev ? { ...prev, isMainImage: true } : null); }}>
                        <Star className="h-4 w-4 mr-2" />Ana Görsel Yap
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Mockup Preview Dialog */}
      <Dialog open={mockupPreviewDialogOpen} onOpenChange={setMockupPreviewDialogOpen}>
        <DialogContent className="bg-white max-w-4xl">
          {selectedPreviewMockup && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPreviewMockup.title}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image src={selectedPreviewMockup.mockupUrl} alt={selectedPreviewMockup.title} fill className="object-contain" />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-500">Kaynak</Label>
                    <p className="font-medium mt-1">{mockupSources.find(s => s.id === selectedPreviewMockup.source)?.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Kategori</Label>
                    <p className="font-medium mt-1">{mockupCategories.find(c => c.id === selectedPreviewMockup.category)?.icon} {mockupCategories.find(c => c.id === selectedPreviewMockup.category)?.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Oluşturulma Tarihi</Label>
                    <p className="font-medium mt-1">{selectedPreviewMockup.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Durum</Label>
                    <div className="mt-1">
                      {selectedPreviewMockup.isSelected ? <Badge className="bg-primary-100 text-primary-700">Seçili</Badge> : <Badge variant="outline">Seçili Değil</Badge>}
                    </div>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full" onClick={() => { toggleMockupSelection(selectedPreviewMockup.id); setSelectedPreviewMockup(prev => prev ? { ...prev, isSelected: !prev.isSelected } : null); }}>
                    {selectedPreviewMockup.isSelected ? 'Seçimi Kaldır' : 'Seç'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Multi-Prompt Dialog */}
      <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Çoklu Prompt Ekle</DialogTitle>
            <DialogDescription>Birden fazla prompt ekleyebilir ve toplu model atayabilirsiniz</DialogDescription>
          </DialogHeader>
          <div className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 space-y-2">
              <Label>Toplu Model Seçimi</Label>
              <Select value={globalModel} onValueChange={(value) => { setGlobalModel(value); setGlobalModelVersion(""); }}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="Model seçin" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {aiPlatforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />{platform.name}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Versiyon</Label>
              <Select value={globalModelVersion} onValueChange={setGlobalModelVersion} disabled={!globalModel}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="Versiyon" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {globalModel && aiPlatforms.find(p => p.id === globalModel)?.versions?.map((version) => (<SelectItem key={version} value={version}>{version}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={applyGlobalModel} disabled={!globalModel}>Tümüne Uygula</Button>
          </div>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {bulkPrompts.map((prompt, index) => (
                <div key={prompt.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Prompt {index + 1}</span>
                    {bulkPrompts.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removePromptRow(prompt.id)}><X className="h-4 w-4" /></Button>)}
                  </div>
                  <Textarea value={prompt.content} onChange={(e) => setBulkPrompts(prev => prev.map(p => p.id === prompt.id ? { ...p, content: e.target.value } : p))} placeholder="Prompt içeriğini girin..." rows={3} />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Select value={prompt.model} onValueChange={(value) => setBulkPrompts(prev => prev.map(p => p.id === prompt.id ? { ...p, model: value, modelVersion: "" } : p))}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Model" /></SelectTrigger>
                        <SelectContent className="bg-white">
                          {aiPlatforms.map((platform) => (<SelectItem key={platform.id} value={platform.id}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />{platform.name}</div></SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select value={prompt.modelVersion} onValueChange={(value) => setBulkPrompts(prev => prev.map(p => p.id === prompt.id ? { ...p, modelVersion: value } : p))} disabled={!prompt.model}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Versiyon" /></SelectTrigger>
                        <SelectContent className="bg-white">
                          {prompt.model && aiPlatforms.find(p => p.id === prompt.model)?.versions?.map((version) => (<SelectItem key={version} value={version}>{version}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={addPromptRow}><Plus className="h-4 w-4 mr-2" />Prompt Ekle</Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={() => setPromptDialogOpen(false)}>İptal</Button>
            <Button onClick={saveBulkPrompts}><Save className="h-4 w-4 mr-2" />Kaydet ({bulkPrompts.filter(p => p.content.trim()).length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Picture Dialog */}
      <Dialog open={pictureDialogOpen} onOpenChange={setPictureDialogOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Çoklu Görsel Ekle</DialogTitle>
          </DialogHeader>
          <div className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 space-y-2">
              <Label>Toplu Model Seçimi</Label>
              <Select value={globalModel} onValueChange={(value) => { setGlobalModel(value); setGlobalModelVersion(""); }}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="Model seçin" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {aiPlatforms.map((platform) => (<SelectItem key={platform.id} value={platform.id}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />{platform.name}</div></SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Versiyon</Label>
              <Select value={globalModelVersion} onValueChange={setGlobalModelVersion} disabled={!globalModel}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="Versiyon" /></SelectTrigger>
                <SelectContent className="bg-white">{globalModel && aiPlatforms.find(p => p.id === globalModel)?.versions?.map((version) => (<SelectItem key={version} value={version}>{version}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <Button onClick={applyGlobalModelToPictures} disabled={!globalModel}>Tümüne Uygula</Button>
          </div>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {bulkPictures.map((picture, index) => (
                <div key={picture.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Görsel {index + 1}</span>
                    {bulkPictures.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removePictureRow(picture.id)}><X className="h-4 w-4" /></Button>)}
                  </div>
                  <Input value={picture.imageUrl} onChange={(e) => setBulkPictures(prev => prev.map(p => p.id === picture.id ? { ...p, imageUrl: e.target.value } : p))} placeholder="Görsel URL/Link" />
                  <div className="grid grid-cols-3 gap-4">
                    <Select value={picture.aiPlatform} onValueChange={(value) => setBulkPictures(prev => prev.map(p => p.id === picture.id ? { ...p, aiPlatform: value, modelVersion: "" } : p))}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Model" /></SelectTrigger>
                      <SelectContent className="bg-white">{aiPlatforms.map((platform) => (<SelectItem key={platform.id} value={platform.id}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />{platform.name}</div></SelectItem>))}</SelectContent>
                    </Select>
                    <Select value={picture.modelVersion} onValueChange={(value) => setBulkPictures(prev => prev.map(p => p.id === picture.id ? { ...p, modelVersion: value } : p))} disabled={!picture.aiPlatform}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Versiyon" /></SelectTrigger>
                      <SelectContent className="bg-white">{picture.aiPlatform && aiPlatforms.find(p => p.id === picture.aiPlatform)?.versions?.map((version) => (<SelectItem key={version} value={version}>{version}</SelectItem>))}</SelectContent>
                    </Select>
                    <Select value={picture.promptId} onValueChange={(value) => setBulkPictures(prev => prev.map(p => p.id === picture.id ? { ...p, promptId: value } : p))}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Prompt (opsiyonel)" /></SelectTrigger>
                      <SelectContent className="bg-white">{prompts.map((prompt) => (<SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={addPictureRow}><Plus className="h-4 w-4 mr-2" />Görsel Ekle</Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={() => setPictureDialogOpen(false)}>İptal</Button>
            <Button onClick={saveBulkPictures}><Save className="h-4 w-4 mr-2" />Kaydet ({bulkPictures.filter(p => p.imageUrl.trim()).length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Mockup Dialog */}
      <Dialog open={mockupDialogOpen} onOpenChange={setMockupDialogOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[85vh]">
          <DialogHeader><DialogTitle>Çoklu Mockup Ekle</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {bulkMockups.map((mockup, index) => (
                <div key={mockup.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Mockup {index + 1}</span>
                    {bulkMockups.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removeMockupRow(mockup.id)}><X className="h-4 w-4" /></Button>)}
                  </div>
                  <Input value={mockup.mockupUrl} onChange={(e) => setBulkMockups(prev => prev.map(m => m.id === mockup.id ? { ...m, mockupUrl: e.target.value } : m))} placeholder="Mockup URL/Link" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={mockup.source} onValueChange={(value) => setBulkMockups(prev => prev.map(m => m.id === mockup.id ? { ...m, source: value } : m))}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Kaynak" /></SelectTrigger>
                      <SelectContent className="bg-white">{mockupSources.map((source) => (<SelectItem key={source.id} value={source.id}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />{source.name}</div></SelectItem>))}</SelectContent>
                    </Select>
                    <Select value={mockup.category} onValueChange={(value) => setBulkMockups(prev => prev.map(m => m.id === mockup.id ? { ...m, category: value } : m))}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Kategori" /></SelectTrigger>
                      <SelectContent className="bg-white">{mockupCategories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={addMockupRow}><Plus className="h-4 w-4 mr-2" />Mockup Ekle</Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={() => setMockupDialogOpen(false)}>İptal</Button>
            <Button onClick={saveBulkMockups}><Save className="h-4 w-4 mr-2" />Kaydet ({bulkMockups.filter(m => m.mockupUrl.trim()).length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Dialog */}
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Yeni Dosya Ekle</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Dosya Adı</Label><Input value={newFile.fileName} onChange={(e) => setNewFile(prev => ({ ...prev, fileName: e.target.value }))} placeholder="dosya.psd" /></div>
              <div className="space-y-2">
                <Label>Dosya Türü</Label>
                <Select value={newFile.fileType} onValueChange={(value) => setNewFile(prev => ({ ...prev, fileType: value }))}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Tür seç" /></SelectTrigger>
                  <SelectContent className="bg-white"><SelectItem value="PSD">PSD</SelectItem><SelectItem value="AI">AI</SelectItem><SelectItem value="PNG">PNG</SelectItem><SelectItem value="JPG">JPG</SelectItem><SelectItem value="SVG">SVG</SelectItem><SelectItem value="PDF">PDF</SelectItem><SelectItem value="ZIP">ZIP</SelectItem><SelectItem value="OTHER">Diğer</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Dosya Yolu/Link</Label><Input value={newFile.filePath} onChange={(e) => setNewFile(prev => ({ ...prev, filePath: e.target.value }))} placeholder="/path/to/file" /></div>
              <div className="space-y-2"><Label>Dosya Boyutu</Label><Input value={newFile.fileSize} onChange={(e) => setNewFile(prev => ({ ...prev, fileSize: e.target.value }))} placeholder="25 MB" /></div>
            </div>
            <div className="space-y-2"><Label>Konsept Notları</Label><Textarea value={newFile.conceptNotes} onChange={(e) => setNewFile(prev => ({ ...prev, conceptNotes: e.target.value }))} placeholder="Dosya ile ilgili notlar..." rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFileDialogOpen(false)}>İptal</Button>
            <Button onClick={() => { setFiles(prev => [...prev, { ...newFile, id: Date.now().toString() }]); setFileDialogOpen(false); setNewFile({ fileName: "", filePath: "", fileType: "", fileSize: "", conceptNotes: "" }); }}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sales Add Dialog */}
      <Dialog open={salesDialogOpen} onOpenChange={setSalesDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Satış Verisi Ekle</DialogTitle><DialogDescription>Platform için manuel satış verisi girin</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={newSalesAmount.platformId} onValueChange={(value) => setNewSalesAmount(prev => ({ ...prev, platformId: value }))}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="Platform seçin" /></SelectTrigger>
                <SelectContent className="bg-white"><SelectItem value="etsy">Etsy</SelectItem><SelectItem value="gumroad">Gumroad</SelectItem><SelectItem value="amazon-kdp">Amazon KDP</SelectItem><SelectItem value="creative-market">Creative Market</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Satış Adedi</Label><Input type="number" value={newSalesAmount.salesCount} onChange={(e) => setNewSalesAmount(prev => ({ ...prev, salesCount: parseInt(e.target.value) || 0 }))} min={0} /></div>
              <div className="space-y-2"><Label>Gelir ($)</Label><Input type="number" value={newSalesAmount.revenue} onChange={(e) => setNewSalesAmount(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))} min={0} step={0.01} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSalesDialogOpen(false)}>İptal</Button><Button onClick={addNewPlatformSales}>Kaydet</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Platform Dialog */}
      <Dialog open={editPlatformDialogOpen} onOpenChange={setEditPlatformDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle>Platform Satış Verilerini Düzenle</DialogTitle><DialogDescription>{editingPlatform?.platformName} için satış verilerini güncelleyin</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Satış Adedi</Label><Input type="number" value={newSalesAmount.salesCount} onChange={(e) => setNewSalesAmount(prev => ({ ...prev, salesCount: parseInt(e.target.value) || 0 }))} min={0} /></div>
              <div className="space-y-2"><Label>Toplam Gelir ($)</Label><Input type="number" value={newSalesAmount.revenue} onChange={(e) => setNewSalesAmount(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))} min={0} step={0.01} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditPlatformDialogOpen(false)}>İptal</Button><Button onClick={saveEditPlatform}>Güncelle</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
