"use client";

import { useState } from "react";
import {
  Gamepad,
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
const gamingAccounts = [
  { id: 1, username: "ProGamer123", platform: "Steam", email: "gamer1@gmail.com", status: "active", games: 150, level: 45, value: "$2,500", lastLogin: "2024-01-15" },
  { id: 2, username: "EpicPlayer", platform: "Epic Games", email: "gamer2@gmail.com", status: "active", games: 85, level: 30, value: "$800", lastLogin: "2024-01-14" },
  { id: 3, username: "XboxKing", platform: "Xbox Live", email: "gamer3@outlook.com", status: "inactive", games: 42, level: 25, value: "$400", lastLogin: "2024-01-10" },
  { id: 4, username: "PSNMaster", platform: "PlayStation", email: "gamer4@gmail.com", status: "active", games: 78, level: 35, value: "$1,200", lastLogin: "2024-01-15" },
  { id: 5, username: "BattleNet_Pro", platform: "Battle.net", email: "gamer5@gmail.com", status: "error", games: 12, level: 60, value: "$300", lastLogin: "2024-01-05" },
  { id: 6, username: "OriginGamer", platform: "EA Origin", email: "gamer6@yahoo.com", status: "active", games: 35, level: 20, value: "$500", lastLogin: "2024-01-15" },
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: CheckCircle },
  inactive: { label: "Pasif", color: "bg-gray-100 text-gray-800", icon: XCircle },
  error: { label: "Hata", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

const platforms = ["Steam", "Epic Games", "Xbox Live", "PlayStation", "Battle.net", "EA Origin", "Ubisoft Connect", "GOG"];

export default function GamingAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredAccounts = gamingAccounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || account.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const totalValue = gamingAccounts.reduce((sum, acc) => {
    const value = parseFloat(acc.value.replace("$", "").replace(",", ""));
    return sum + value;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gamepad className="h-7 w-7 text-primary-600" />
            Oyun Hesapları
          </h1>
          <p className="text-gray-500 mt-1">
            Oyun platformu hesaplarınızı yönetin
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
              <DialogTitle>Yeni Oyun Hesabı</DialogTitle>
              <DialogDescription>
                Yeni bir oyun platformu hesabı ekleyin.
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
                <Input placeholder="ProGamer123" />
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
                <Label>Tahmini Değer</Label>
                <Input placeholder="$1,000" />
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
                <Gamepad className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{gamingAccounts.length}</div>
                <p className="text-sm text-gray-500">Toplam Hesap</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {gamingAccounts.filter((a) => a.status === "active").length}
                </div>
                <p className="text-sm text-gray-500">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Gamepad className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {gamingAccounts.reduce((sum, a) => sum + a.games, 0)}
                </div>
                <p className="text-sm text-gray-500">Toplam Oyun</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <span className="text-emerald-600 font-bold">$</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Toplam Değer</p>
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
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <Gamepad className="h-6 w-6 text-white" />
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
                        Platforma Git
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
                  <div className="flex items-center justify-between">
                    <Badge className={statusConfig[account.status as keyof typeof statusConfig].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[account.status as keyof typeof statusConfig].label}
                    </Badge>
                    <span className="text-lg font-bold text-emerald-600">{account.value}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-gray-50">
                      <p className="text-gray-500">Oyun Sayısı</p>
                      <p className="font-semibold text-gray-900">{account.games}</p>
                    </div>
                    <div className="p-2 rounded bg-gray-50">
                      <p className="text-gray-500">Seviye</p>
                      <p className="font-semibold text-gray-900">{account.level}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Son giriş: {account.lastLogin}
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


