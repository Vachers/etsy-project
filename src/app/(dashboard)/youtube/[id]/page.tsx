"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Youtube,
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  PlaySquare,
  Eye,
  BarChart3,
  Calendar,
  Mail,
  Key,
  Link as LinkIcon,
  DollarSign,
  Plus,
  MoreHorizontal,
  Video,
  FileText,
  Settings,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  Upload,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { getMockYoutubeChannelById, type YouTubeChannel, type YouTubeVideo } from "@/lib/mock-data";

const statusConfig = {
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: CheckCircle },
  inactive: { label: "Pasif", color: "bg-gray-100 text-gray-800", icon: XCircle },
  suspended: { label: "Askıda", color: "bg-red-100 text-red-800", icon: AlertCircle },
  pending: { label: "Beklemede", color: "bg-amber-100 text-amber-800", icon: Clock },
};

const videoStatusConfig = {
  draft: { label: "Taslak", color: "bg-gray-100 text-gray-800" },
  scheduled: { label: "Planlandı", color: "bg-blue-100 text-blue-800" },
  published: { label: "Yayında", color: "bg-green-100 text-green-800" },
  private: { label: "Gizli", color: "bg-amber-100 text-amber-800" },
  unlisted: { label: "Liste Dışı", color: "bg-purple-100 text-purple-800" },
};

// Mock videos for the channel
const mockVideos: YouTubeVideo[] = [
  {
    id: "vid-1",
    channelId: "yt-channel-1",
    title: "React 19 - Yeni Özellikler ve Best Practices",
    description: "React 19 ile gelen yeni özellikler...",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    videoUrl: "https://youtube.com/watch?v=abc123",
    status: "published",
    prompt: "React 19 hakkında 10 dakikalık eğitim videosu...",
    tags: ["react", "javascript", "web development"],
    viewCount: 12500,
    likeCount: 890,
    commentCount: 56,
    publishedAt: new Date("2024-02-15"),
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "vid-2",
    channelId: "yt-channel-1",
    title: "TypeScript İpuçları - Daha Temiz Kod Yazın",
    description: "TypeScript ile daha iyi kod yazmak için ipuçları...",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=225&fit=crop",
    status: "published",
    tags: ["typescript", "programming"],
    viewCount: 8900,
    likeCount: 567,
    commentCount: 34,
    publishedAt: new Date("2024-02-10"),
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "vid-3",
    channelId: "yt-channel-1",
    title: "Next.js 15 - App Router Derinlemesine",
    description: "Next.js App Router ile modern web uygulamaları...",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    status: "scheduled",
    prompt: "Next.js 15 App Router hakkında kapsamlı rehber...",
    tags: ["nextjs", "react", "ssr"],
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-26"),
  },
  {
    id: "vid-4",
    channelId: "yt-channel-1",
    title: "Tailwind CSS 4.0 - Neler Değişti?",
    description: "Tailwind CSS 4.0 ile gelen yenilikler...",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop",
    status: "draft",
    tags: ["tailwind", "css"],
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-02-28"),
  },
];

export default function YoutubeChannelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>(mockVideos);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    channelUrl: "",
    handle: "",
    description: "",
    thumbnail: "",
    niche: "",
    monetized: false,
    notes: "",
  });

  // Video form state
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    description: "",
    prompt: "",
    tags: "",
    status: "draft" as YouTubeVideo["status"],
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const channelData = getMockYoutubeChannelById(params.id as string);
      if (channelData) {
        setChannel(channelData);
        setFormData({
          name: channelData.name,
          email: channelData.email,
          password: channelData.password,
          channelUrl: channelData.channelUrl,
          handle: channelData.handle || "",
          description: channelData.description || "",
          thumbnail: channelData.thumbnail || "",
          niche: channelData.niche || "",
          monetized: channelData.monetized,
          notes: channelData.notes || "",
        });
      }
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleSaveChannel = () => {
    if (channel) {
      setChannel({
        ...channel,
        ...formData,
        updatedAt: new Date(),
      });
    }
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    router.push("/youtube");
  };

  const handleAddVideo = () => {
    const newVideo: YouTubeVideo = {
      id: `vid-${Date.now()}`,
      channelId: channel?.id || "",
      title: videoFormData.title,
      description: videoFormData.description,
      prompt: videoFormData.prompt,
      status: videoFormData.status,
      tags: videoFormData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setVideos([newVideo, ...videos]);
    setIsVideoDialogOpen(false);
    setVideoFormData({
      title: "",
      description: "",
      prompt: "",
      tags: "",
      status: "draft",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <Youtube className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Kanal Bulunamadı</h3>
        <p className="text-gray-500 mt-1">Bu YouTube kanalı mevcut değil.</p>
        <Link href="/youtube">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[channel.status].icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/youtube">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-red-50">
              {channel.thumbnail ? (
                <img
                  src={channel.thumbnail}
                  alt={channel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Youtube className="h-8 w-8 text-red-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{channel.name}</h1>
                {channel.monetized && (
                  <Badge className="bg-green-100 text-green-700">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Monetize
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                {channel.handle && <span>{channel.handle}</span>}
                {channel.niche && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{channel.niche}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-12 lg:ml-0 flex-wrap">
          <Badge className={statusConfig[channel.status].color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[channel.status].label}
          </Badge>
          {channel.channelUrl && (
            <a href={channel.channelUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                YouTube'da Aç
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
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abone</p>
                <p className="text-xl font-bold text-red-600">
                  {formatNumber(channel.subscriberCount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">İzlenme</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatNumber(channel.viewCount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <PlaySquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Video</p>
                <p className="text-xl font-bold text-purple-600">{channel.videoCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ort. İzlenme</p>
                <p className="text-xl font-bold text-green-600">
                  {channel.videoCount > 0
                    ? formatNumber(Math.round(channel.viewCount / channel.videoCount))
                    : "0"}
                </p>
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
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
          >
            <Video className="h-4 w-4 mr-2" />
            Videolar
          </TabsTrigger>
          <TabsTrigger
            value="credentials"
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
          >
            <Key className="h-4 w-4 mr-2" />
            Kimlik Bilgileri
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Channel Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kanal Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {channel.description && (
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500 mb-1">Açıklama</p>
                    <p className="text-gray-700">{channel.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Oluşturulma</p>
                    <p className="font-medium">
                      {channel.createdAt.toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Son Güncelleme</p>
                    <p className="font-medium">
                      {channel.updatedAt.toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
                {channel.notes && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-800 font-medium mb-1">Notlar</p>
                    <p className="text-amber-700 text-sm">{channel.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Videos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Son Videolar</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setIsVideoDialogOpen(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Video Ekle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videos.slice(0, 4).map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-12 rounded bg-gray-200 overflow-hidden shrink-0">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {video.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge
                            variant="outline"
                            className={`text-xs ${videoStatusConfig[video.status].color}`}
                          >
                            {videoStatusConfig[video.status].label}
                          </Badge>
                          {video.viewCount > 0 && (
                            <span>{formatNumber(video.viewCount)} izlenme</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Videolar</h3>
              <p className="text-sm text-gray-500">{videos.length} video</p>
            </div>
            <Button
              onClick={() => setIsVideoDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Video Ekle
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 ${videoStatusConfig[video.status].color}`}
                  >
                    {videoStatusConfig[video.status].label}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h4>
                  {video.prompt && (
                    <div className="mt-2 p-2 rounded bg-purple-50 border border-purple-100">
                      <p className="text-xs text-purple-600 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Prompt mevcut
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatNumber(video.viewCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {video.commentCount}
                    </span>
                  </div>
                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-400" />
                Giriş Bilgileri
              </CardTitle>
              <CardDescription>
                Bu kanal için kayıtlı giriş bilgileri. Güvenlik nedeniyle dikkatli olun.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <p className="font-medium">{channel.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(channel.email)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Şifre</p>
                      <p className="font-medium font-mono">
                        {showPassword ? channel.password : "••••••••"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(channel.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Kanal URL</p>
                      <p className="font-medium text-sm truncate max-w-[300px]">
                        {channel.channelUrl}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(channel.channelUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Güvenlik Uyarısı:</strong> Bu bilgileri güvenli bir şekilde saklayın
                  ve yetkisiz kişilerle paylaşmayın.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kanal Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Kanal Durumu</p>
                  <p className="text-sm text-gray-500">Kanalın aktif/pasif durumunu değiştirin</p>
                </div>
                <Badge className={statusConfig[channel.status].color}>
                  {statusConfig[channel.status].label}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Monetizasyon</p>
                  <p className="text-sm text-gray-500">YouTube Partner Programı durumu</p>
                </div>
                <Switch checked={channel.monetized} disabled />
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Kanalı Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Channel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              Kanalı Düzenle
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Kanal Adı *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-posta *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Şifre *</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-channelUrl">Kanal URL *</Label>
              <Input
                id="edit-channelUrl"
                value={formData.channelUrl}
                onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-handle">Handle</Label>
              <Input
                id="edit-handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Açıklama</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-monetized"
                checked={formData.monetized}
                onCheckedChange={(checked) => setFormData({ ...formData, monetized: checked })}
              />
              <Label htmlFor="edit-monetized">Monetize Edilmiş</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notlar</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveChannel} className="bg-red-600 hover:bg-red-700">
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              Yeni Video Ekle
            </DialogTitle>
            <DialogDescription>
              Bu kanala yeni bir video içeriği ekleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="video-title">Video Başlığı *</Label>
              <Input
                id="video-title"
                value={videoFormData.title}
                onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                placeholder="Video başlığı..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-description">Açıklama</Label>
              <Textarea
                id="video-description"
                value={videoFormData.description}
                onChange={(e) =>
                  setVideoFormData({ ...videoFormData, description: e.target.value })
                }
                placeholder="Video açıklaması..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-prompt" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Video Promptu
              </Label>
              <Textarea
                id="video-prompt"
                value={videoFormData.prompt}
                onChange={(e) => setVideoFormData({ ...videoFormData, prompt: e.target.value })}
                placeholder="AI video üretimi için prompt..."
                rows={3}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-tags">Etiketler (virgülle ayırın)</Label>
              <Input
                id="video-tags"
                value={videoFormData.tags}
                onChange={(e) => setVideoFormData({ ...videoFormData, tags: e.target.value })}
                placeholder="react, javascript, tutorial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-status">Durum</Label>
              <Select
                value={videoFormData.status}
                onValueChange={(value: YouTubeVideo["status"]) =>
                  setVideoFormData({ ...videoFormData, status: value })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="scheduled">Planlandı</SelectItem>
                  <SelectItem value="published">Yayında</SelectItem>
                  <SelectItem value="private">Gizli</SelectItem>
                  <SelectItem value="unlisted">Liste Dışı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleAddVideo}
              disabled={!videoFormData.title}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Video Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Kanalı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. "{channel.name}" kanalı ve tüm ilişkili veriler kalıcı
              olarak silinecektir.
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


