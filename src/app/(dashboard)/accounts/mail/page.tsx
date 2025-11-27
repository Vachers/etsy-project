"use client";

import { useState, useRef } from "react";
import {
  Mail,
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Eye,
  Copy,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const mailAccounts = [
  { id: 1, email: "user1@gmail.com", provider: "Gmail", status: "active", password: "••••••••", lastCheck: "2024-01-15", notes: "" },
  { id: 2, email: "user2@outlook.com", provider: "Outlook", status: "active", password: "••••••••", lastCheck: "2024-01-15", notes: "" },
  { id: 3, email: "user3@yahoo.com", provider: "Yahoo", status: "inactive", password: "••••••••", lastCheck: "2024-01-14", notes: "Şifre değiştirilmeli" },
  { id: 4, email: "user4@gmail.com", provider: "Gmail", status: "active", password: "••••••••", lastCheck: "2024-01-15", notes: "" },
  { id: 5, email: "user5@proton.me", provider: "ProtonMail", status: "error", password: "••••••••", lastCheck: "2024-01-13", notes: "Hesap kilitli" },
  { id: 6, email: "user6@icloud.com", provider: "iCloud", status: "active", password: "••••••••", lastCheck: "2024-01-15", notes: "" },
  { id: 7, email: "user7@gmail.com", provider: "Gmail", status: "active", password: "••••••••", lastCheck: "2024-01-15", notes: "" },
  { id: 8, email: "user8@outlook.com", provider: "Outlook", status: "inactive", password: "••••••••", lastCheck: "2024-01-12", notes: "" },
];

const statusConfig = {
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: CheckCircle },
  inactive: { label: "Pasif", color: "bg-gray-100 text-gray-800", icon: XCircle },
  error: { label: "Hata", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

const providers = ["Gmail", "Outlook", "Yahoo", "ProtonMail", "iCloud", "Diğer"];

export default function MailAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAccounts = mailAccounts.filter((account) => {
    const matchesSearch = account.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = filterProvider === "all" || account.provider === filterProvider;
    const matchesStatus = filterStatus === "all" || account.status === filterStatus;
    return matchesSearch && matchesProvider && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map((a) => a.id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportData(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const stats = {
    total: mailAccounts.length,
    active: mailAccounts.filter((a) => a.status === "active").length,
    inactive: mailAccounts.filter((a) => a.status === "inactive").length,
    error: mailAccounts.filter((a) => a.status === "error").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-7 w-7 text-primary-600" />
            Mail Hesapları
          </h1>
          <p className="text-gray-500 mt-1">
            E-posta hesaplarınızı yönetin ve toplu import yapın
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white">
              <DialogHeader>
                <DialogTitle>Mail Hesapları Import</DialogTitle>
                <DialogDescription>
                  CSV veya metin formatında mail hesaplarını toplu olarak ekleyin.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileSpreadsheet className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    CSV dosyası yükleyin veya aşağıya yapıştırın
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Dosya Seç
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Veri (email:password formatında)</Label>
                  <Textarea
                    placeholder="user1@gmail.com:password123&#10;user2@outlook.com:pass456"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Her satırda bir hesap olacak şekilde email:password formatında girin.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                  İptal
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Et
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Hesap Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Yeni Mail Hesabı</DialogTitle>
                <DialogDescription>
                  Yeni bir mail hesabı ekleyin.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>E-posta Adresi</Label>
                  <Input type="email" placeholder="ornek@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Şifre</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Sağlayıcı</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sağlayıcı seçin" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {providers.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Mail className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
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
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <p className="text-sm text-gray-500">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
                <p className="text-sm text-gray-500">Pasif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.error}</div>
                <p className="text-sm text-gray-500">Hata</p>
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
            placeholder="E-posta ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterProvider} onValueChange={setFilterProvider}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Sağlayıcı" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Sağlayıcılar</SelectItem>
            {providers.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Pasif</SelectItem>
            <SelectItem value="error">Hata</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedAccounts.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-primary-50 rounded-lg">
          <span className="text-sm font-medium text-primary-700">
            {selectedAccounts.length} hesap seçildi
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <CheckCircle className="h-4 w-4 mr-1" />
              Aktif Yap
            </Button>
            <Button size="sm" variant="outline">
              <XCircle className="h-4 w-4 mr-1" />
              Pasif Yap
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-1" />
              Sil
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">E-posta</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Sağlayıcı</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Durum</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Son Kontrol</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Notlar</th>
                <th className="p-4 text-right text-sm font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => {
                const StatusIcon = statusConfig[account.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={account.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAccounts([...selectedAccounts, account.id]);
                          } else {
                            setSelectedAccounts(selectedAccounts.filter((id) => id !== account.id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{account.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{account.provider}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={statusConfig[account.status as keyof typeof statusConfig].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[account.status as keyof typeof statusConfig].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{account.lastCheck}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                      {account.notes || "-"}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Şifreyi Göster
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Kopyala
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


