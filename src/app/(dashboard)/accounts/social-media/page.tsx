"use client";

import { useState } from "react";
import {
  AtSign,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Copy,
  Trash2,
  ExternalLink,
  Users,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data
const socialAccounts = [
  { id: 1, username: "@digitalcreator", platform: "Instagram", email: "creator1@gmail.com", status: "active", followers: 15420, posts: 245, engagement: "4.2%", lastPost: "2024-01-15" },
  { id: 2, username: "@techinfluencer", platform: "Twitter/X", email: "tech@gmail.com", status: "active", followers: 8750, posts: 1520, engagement: "2.8%", lastPost: "2024-01-15" },
  { id: 3, username: "BusinessPage", platform: "Facebook", email: "business@company.com", status: "active", followers: 25000, posts: 890, engagement: "1.5%", lastPost: "2024-01-14" },
  { id: 4, username: "@creativestudio", platform: "TikTok", email: "studio@gmail.com", status: "inactive", followers: 45000, posts: 180, engagement: "8.5%", lastPost: "2024-01-10" },
  { id: 5, username: "ProChannel", platform: "YouTube", email: "channel@gmail.com", status: "active", followers: 12500, posts: 95, engagement: "5.2%", lastPost: "2024-01-13" },
  { id: 6, username: "@designpro", platform: "LinkedIn", email: "design@gmail.com", status: "error", followers: 3200, posts: 120, engagement: "3.8%", lastPost: "2024-01-08" },
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: CheckCircle },
  inactive: { label: "Pasif", color: "bg-gray-100 text-gray-800", icon: XCircle },
  error: { label: "Hata", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

const platforms = ["Instagram", "Twitter/X", "Facebook", "TikTok", "YouTube", "LinkedIn", "Pinterest", "Snapchat"];

const platformColors: Record<string, string> = {
  Instagram: "from-purple-500 to-pink-500",
  "Twitter/X": "from-gray-700 to-gray-900",
  Facebook: "from-blue-600 to-blue-700",
  TikTok: "from-gray-900 to-pink-500",
  YouTube: "from-red-500 to-red-600",
  LinkedIn: "from-blue-700 to-blue-800",
  Pinterest: "from-red-600 to-red-700",
  Snapchat: "from-yellow-400 to-yellow-500",
};

export default function SocialMediaAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredAccounts = socialAccounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || account.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const totalFollowers = socialAccounts.reduce((sum, acc) => sum + acc.followers, 0);
  const totalPosts = socialAccounts.reduce((sum, acc) => sum + acc.posts, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AtSign className="h-7 w-7 text-primary-600" />
            Sosyal Medya Hesapları
          </h1>
          <p className="text-gray-500 mt-1">
            Sosyal medya hesaplarınızı yönetin ve takip edin
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Hesap Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Yeni Sosyal Medya Hesabı</DialogTitle>
              <DialogDescription>
                Yeni bir sosyal medya hesabı ekleyin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Platform seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kullanıcı Adı</Label>
                <Input placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input type="email" placeholder="ornek@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>Şifre</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Profil URL (opsiyonel)</Label>
                <Input placeholder="https://instagram.com/username" />
              </div>
              <div className="space-y-2">
                <Label>Notlar (opsiyonel)</Label>
                <Textarea placeholder="Hesap hakkında notlar..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                İptal
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                Kaydet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <AtSign className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{socialAccounts.length}</div>
                <p className="text-sm text-gray-500">Toplam Hesap</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(totalFollowers / 1000).toFixed(1)}K
                </div>
                <p className="text-sm text-gray-500">Toplam Takipçi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalPosts.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Toplam Gönderi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(socialAccounts.reduce((sum, a) => sum + parseFloat(a.engagement), 0) / socialAccounts.length).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500">Ort. Etkileşim</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Hesap ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Platformlar</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filtrele
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAccounts.map((account) => {
          const StatusIcon = statusConfig[account.status as keyof typeof statusConfig].icon;
          const gradient = platformColors[account.platform] || "from-gray-500 to-gray-600";
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
                      <AtSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.username}</h3>
                      <p className="text-sm text-gray-500">{account.platform}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Detayları Gör
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Bilgileri Kopyala
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Profile Git
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <Badge className={statusConfig[account.status as keyof typeof statusConfig].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[account.status as keyof typeof statusConfig].label}
                  </Badge>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded bg-gray-50 text-center">
                      <p className="text-gray-500 text-xs">Takipçi</p>
                      <p className="font-semibold text-gray-900">
                        {account.followers >= 1000 
                          ? `${(account.followers / 1000).toFixed(1)}K`
                          : account.followers}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-gray-50 text-center">
                      <p className="text-gray-500 text-xs">Gönderi</p>
                      <p className="font-semibold text-gray-900">{account.posts}</p>
                    </div>
                    <div className="p-2 rounded bg-gray-50 text-center">
                      <p className="text-gray-500 text-xs">Etkileşim</p>
                      <p className="font-semibold text-emerald-600">{account.engagement}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Son paylaşım: {account.lastPost}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


