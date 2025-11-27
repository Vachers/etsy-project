"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Youtube,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Users,
  PlaySquare,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Key,
  Link as LinkIcon,
  DollarSign,
  ArrowUpRight,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockYoutubeChannels, type YouTubeChannel } from "@/lib/mock-data";

const statusConfig = {
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: CheckCircle },
  inactive: { label: "Pasif", color: "bg-gray-100 text-gray-800", icon: XCircle },
  suspended: { label: "Askıda", color: "bg-red-100 text-red-800", icon: AlertCircle },
  pending: { label: "Beklemede", color: "bg-amber-100 text-amber-800", icon: Clock },
};

const nicheOptions = [
  "Technology",
  "AI & Automation",
  "Design",
  "Business",
  "Wellness",
  "Gaming",
  "Cooking",
  "Finance",
  "Education",
  "Entertainment",
  "Music",
  "Sports",
  "Travel",
  "Fashion",
  "Other",
];

export default function YoutubePage() {
  const router = useRouter();
  const [channels, setChannels] = useState<YouTubeChannel[]>(mockYoutubeChannels);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<YouTubeChannel | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
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

  // Filter channels
  const filteredChannels = channels.filter((channel) => {
    const matchesSearch =
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.handle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || channel.status === statusFilter;
    const matchesNiche = nicheFilter === "all" || channel.niche === nicheFilter;
    return matchesSearch && matchesStatus && matchesNiche;
  });

  // Stats
  const stats = {
    total: channels.length,
    active: channels.filter((c) => c.status === "active").length,
    monetized: channels.filter((c) => c.monetized).length,
    totalSubscribers: channels.reduce((sum, c) => sum + c.subscriberCount, 0),
    totalViews: channels.reduce((sum, c) => sum + c.viewCount, 0),
    totalVideos: channels.reduce((sum, c) => sum + c.videoCount, 0),
  };

  const handleOpenDialog = (channel?: YouTubeChannel) => {
    if (channel) {
      setEditingChannel(channel);
      setFormData({
        name: channel.name,
        email: channel.email,
        password: channel.password,
        channelUrl: channel.channelUrl,
        handle: channel.handle || "",
        description: channel.description || "",
        thumbnail: channel.thumbnail || "",
        niche: channel.niche || "",
        monetized: channel.monetized,
        notes: channel.notes || "",
      });
    } else {
      setEditingChannel(null);
      setFormData({
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
    }
    setIsDialogOpen(true);
  };

  const handleSaveChannel = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.channelUrl) {
      return;
    }

    if (editingChannel) {
      setChannels(
        channels.map((c) =>
          c.id === editingChannel.id
            ? {
                ...c,
                ...formData,
                updatedAt: new Date(),
              }
            : c
        )
      );
    } else {
      const newChannel: YouTubeChannel = {
        id: `yt-channel-${Date.now()}`,
        ...formData,
        subscriberCount: 0,
        videoCount: 0,
        viewCount: 0,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChannels([...channels, newChannel]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteChannel = (id: string) => {
    setChannels(channels.filter((c) => c.id !== id));
  };

  const handleViewChannel = (id: string) => {
    router.push(`/youtube/${id}`);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Youtube className="h-7 w-7 text-red-600" />
            YouTube Kanalları
          </h1>
          <p className="text-gray-500 mt-1">
            YouTube kanallarınızı yönetin ve içerik planlayın
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kanal Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Youtube className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Kanal</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif</p>
                <p className="text-xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monetize</p>
                <p className="text-xl font-bold text-amber-600">{stats.monetized}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abone</p>
                <p className="text-xl font-bold text-red-600">{formatNumber(stats.totalSubscribers)}</p>
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
                <p className="text-xl font-bold text-blue-600">{formatNumber(stats.totalViews)}</p>
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
                <p className="text-xl font-bold text-purple-600">{stats.totalVideos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Kanal ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px] bg-white">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Pasif</SelectItem>
            <SelectItem value="pending">Beklemede</SelectItem>
            <SelectItem value="suspended">Askıda</SelectItem>
          </SelectContent>
        </Select>
        <Select value={nicheFilter} onValueChange={setNicheFilter}>
          <SelectTrigger className="w-full sm:w-[150px] bg-white">
            <SelectValue placeholder="Niş" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Nişler</SelectItem>
            {nicheOptions.map((niche) => (
              <SelectItem key={niche} value={niche}>
                {niche}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1 bg-white">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Channels Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChannels.map((channel) => {
            const StatusIcon = statusConfig[channel.status].icon;
            return (
              <Card
                key={channel.id}
                className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-red-200"
                onClick={() => handleViewChannel(channel.id)}
              >
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-t-lg overflow-hidden">
                    {channel.thumbnail && (
                      <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
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
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      {channel.monetized && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Monetize
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 left-2 h-8 w-8 bg-white/80 hover:bg-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-white">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewChannel(channel.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detayları Gör
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(channel);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        {channel.channelUrl && (
                          <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                            <a
                              href={channel.channelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              YouTube'da Aç
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChannel(channel.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors flex items-center gap-1">
                        {channel.name}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      {channel.handle && (
                        <p className="text-sm text-gray-500">{channel.handle}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={statusConfig[channel.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[channel.status].label}
                      </Badge>
                      {channel.niche && (
                        <Badge variant="outline" className="text-xs">
                          {channel.niche}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatNumber(channel.subscriberCount)}
                        </p>
                        <p className="text-xs text-gray-500">Abone</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatNumber(channel.viewCount)}
                        </p>
                        <p className="text-xs text-gray-500">İzlenme</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{channel.videoCount}</p>
                        <p className="text-xs text-gray-500">Video</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredChannels.map((channel) => {
                const StatusIcon = statusConfig[channel.status].icon;
                return (
                  <div
                    key={channel.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer group"
                    onClick={() => handleViewChannel(channel.id)}
                  >
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center overflow-hidden shrink-0">
                      {channel.thumbnail ? (
                        <img
                          src={channel.thumbnail}
                          alt={channel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Youtube className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 truncate">
                          {channel.name}
                        </h3>
                        {channel.monetized && (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{channel.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {formatNumber(channel.subscriberCount)}
                        </p>
                        <p className="text-xs">Abone</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{channel.videoCount}</p>
                        <p className="text-xs">Video</p>
                      </div>
                    </div>
                    <Badge className={statusConfig[channel.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[channel.status].label}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewChannel(channel.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detayları Gör
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(channel);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChannel(channel.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredChannels.length === 0 && (
        <div className="text-center py-12">
          <Youtube className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Kanal Bulunamadı</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery || statusFilter !== "all" || nicheFilter !== "all"
              ? "Arama kriterlerinize uygun kanal yok."
              : "Henüz YouTube kanalı eklemediniz."}
          </p>
          <Button onClick={() => handleOpenDialog()} className="mt-4 bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            İlk Kanalınızı Ekleyin
          </Button>
        </div>
      )}

      {/* Add/Edit Channel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              {editingChannel ? "Kanalı Düzenle" : "Yeni YouTube Kanalı"}
            </DialogTitle>
            <DialogDescription>
              {editingChannel
                ? "YouTube kanal bilgilerini güncelleyin."
                : "Yeni bir YouTube kanalı eklemek için bilgileri doldurun."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white">
                Temel Bilgiler
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white">
                Detaylar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-gray-400" />
                  Kanal Adı *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="örn: Tech Tutorials TR"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    E-posta *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kanal@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-400" />
                    Şifre *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelUrl" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                  Kanal URL *
                </Label>
                <Input
                  id="channelUrl"
                  type="url"
                  value={formData.channelUrl}
                  onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                  placeholder="https://youtube.com/@KanalAdi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handle">Handle (Kullanıcı Adı)</Label>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="@KanalAdi"
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
                {formData.thumbnail && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border">
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Niş / Kategori</Label>
                <Select
                  value={formData.niche}
                  onValueChange={(value) => setFormData({ ...formData, niche: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Niş seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {nicheOptions.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Kanal Açıklaması</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kanal hakkında kısa açıklama..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <Switch
                  id="monetized"
                  checked={formData.monetized}
                  onCheckedChange={(checked) => setFormData({ ...formData, monetized: checked })}
                />
                <div className="flex-1">
                  <Label htmlFor="monetized" className="font-medium">
                    Monetize Edilmiş
                  </Label>
                  <p className="text-xs text-gray-500">
                    Kanal YouTube Partner Programı'na dahil mi?
                  </p>
                </div>
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Kanal ile ilgili notlar..."
                  rows={2}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleSaveChannel}
              disabled={
                !formData.name || !formData.email || !formData.password || !formData.channelUrl
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {editingChannel ? "Güncelle" : "Kanal Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
