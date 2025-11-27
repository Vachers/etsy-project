"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { PlatformForm } from "@/components/forms/platform-form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Store,
  Loader2,
  Percent,
  Download,
} from "lucide-react";
import { salesPlatforms } from "@/lib/platforms";

interface Platform {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  websiteUrl: string | null;
  commissionRate: number;
  defaultCurrency: string;
  color: string;
  description: string | null;
  isActive: boolean;
  _count: {
    listings: number;
  };
}

export default function PlatformsPage() {
  // Use mock platforms directly for initial display
  const [platforms, setPlatforms] = useState<Platform[]>(() => 
    salesPlatforms.map((p, idx) => ({
      id: `plt-${idx + 1}`,
      name: p.name,
      slug: p.slug,
      logo: p.logo || null,
      websiteUrl: p.websiteUrl,
      commissionRate: p.commissionRate,
      defaultCurrency: p.defaultCurrency,
      color: p.color,
      description: p.description,
      isActive: true,
      _count: { listings: Math.floor(Math.random() * 50) },
    }))
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [platformToDelete, setPlatformToDelete] = useState<Platform | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const seedPlatforms = async () => {
    setSeeding(true);
    try {
      // Add each platform from the salesPlatforms list
      for (const platform of salesPlatforms) {
        await fetch("/api/platforms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(platform),
        });
      }
      fetchPlatforms();
    } catch (error) {
      console.error("Error seeding platforms:", error);
    } finally {
      setSeeding(false);
    }
  };

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/platforms");
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setPlatforms(data);
        }
      }
    } catch (error) {
      console.error("Error fetching platforms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to fetch from API, if fails, keep using mock data
    fetchPlatforms();
  }, []);

  const handleEdit = (platform: Platform) => {
    setEditingPlatform(platform);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!platformToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/platforms/${platformToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPlatforms();
      } else {
        const data = await response.json();
        alert(data.error || "Platform silinemedi");
      }
    } catch (error) {
      console.error("Error deleting platform:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPlatformToDelete(null);
    }
  };

  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      TRY: "₺",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
            <Store className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Platform Yönetimi
            </h1>
            <p className="text-sm text-gray-500">
              Satış platformlarını ekleyin ve yönetin
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={seedPlatforms}
            disabled={seeding}
          >
            {seeding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            DB&apos;ye Kaydet
          </Button>
          <Button
            onClick={() => {
              setEditingPlatform(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Platform
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Toplam Platform</p>
          <p className="text-2xl font-bold text-primary-600">
            {platforms.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Aktif Platform</p>
          <p className="text-2xl font-bold text-secondary-600">
            {platforms.filter((p) => p.isActive).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Toplam Ürün Listesi</p>
          <p className="text-2xl font-bold text-purple-600">
            {platforms.reduce((sum, p) => sum + p._count.listings, 0)}
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Platform ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : filteredPlatforms.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-gray-500">
            <Store className="mb-2 h-12 w-12 text-gray-300" />
            <p>Henüz platform eklenmemiş</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setFormOpen(true)}
            >
              İlk platformu ekle
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Komisyon</TableHead>
                <TableHead>Para Birimi</TableHead>
                <TableHead>Ürün Sayısı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlatforms.map((platform) => (
                <TableRow key={platform.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.logo ? (
                          <img
                            src={platform.logo}
                            alt={platform.name}
                            className="h-6 w-6 object-contain"
                          />
                        ) : (
                          platform.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-xs text-gray-500">{platform.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-gray-400" />
                      <span>{Number(platform.commissionRate).toFixed(2)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCurrencySymbol(platform.defaultCurrency)}{" "}
                      {platform.defaultCurrency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {platform._count.listings}
                    </span>{" "}
                    ürün
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        platform.isActive
                          ? "bg-secondary-100 text-secondary-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {platform.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {platform.websiteUrl && (
                          <DropdownMenuItem asChild>
                            <a
                              href={platform.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Siteyi Aç
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(platform)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setPlatformToDelete(platform);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Platform Form Dialog */}
      <PlatformForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPlatform(null);
        }}
        platform={editingPlatform ? {
          id: editingPlatform.id,
          name: editingPlatform.name,
          slug: editingPlatform.slug,
          logo: editingPlatform.logo || "",
          websiteUrl: editingPlatform.websiteUrl || "",
          commissionRate: editingPlatform.commissionRate,
          defaultCurrency: editingPlatform.defaultCurrency,
          color: editingPlatform.color,
          description: editingPlatform.description || "",
          isActive: editingPlatform.isActive,
        } : null}
        onSuccess={fetchPlatforms}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Platform Silinecek</AlertDialogTitle>
            <AlertDialogDescription>
              {platformToDelete?.name} platformunu silmek istediğinizden emin
              misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

