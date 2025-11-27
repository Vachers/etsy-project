"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface PlatformFormData {
  id?: string;
  name: string;
  slug: string;
  logo?: string | null;
  websiteUrl?: string | null;
  commissionRate?: number | null;
  defaultCurrency?: string | null;
  color?: string | null;
  description?: string | null;
  isActive: boolean;
}

interface PlatformFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform?: PlatformFormData | null;
  onSuccess: () => void;
}

const currencies = [
  { value: "TRY", label: "Türk Lirası (₺)" },
  { value: "USD", label: "ABD Doları ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "İngiliz Sterlini (£)" },
];

const colorOptions = [
  { value: "#2563eb", label: "Mavi" },
  { value: "#059669", label: "Yeşil" },
  { value: "#dc2626", label: "Kırmızı" },
  { value: "#7c3aed", label: "Mor" },
  { value: "#f59e0b", label: "Turuncu" },
  { value: "#ec4899", label: "Pembe" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#84cc16", label: "Lime" },
];

export function PlatformForm({
  open,
  onOpenChange,
  platform,
  onSuccess,
}: PlatformFormProps) {
  const isEditing = !!platform?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PlatformFormData>({
    name: platform?.name || "",
    slug: platform?.slug || "",
    logo: platform?.logo || "",
    websiteUrl: platform?.websiteUrl || "",
    commissionRate: platform?.commissionRate || 0,
    defaultCurrency: platform?.defaultCurrency || "USD",
    color: platform?.color || "#2563eb",
    description: platform?.description || "",
    isActive: platform?.isActive ?? true,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/platforms/${platform.id}`
        : "/api/platforms";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Platform Düzenle" : "Yeni Platform Ekle"}
          </DialogTitle>
          <DialogDescription>
            Satış platformu bilgilerini girin. Komisyon oranı brüt gelirden
            düşülecektir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Platform Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Örn: Etsy"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="Örn: etsy"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Komisyon Oranı (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commissionRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commissionRate: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="Örn: 6.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Varsayılan Para Birimi</Label>
              <Select
                value={formData.defaultCurrency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, defaultCurrency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Web Sitesi URL</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
              }
              placeholder="https://www.etsy.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              type="url"
              value={formData.logo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, logo: e.target.value }))
              }
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label>Renk</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    formData.color === option.value
                      ? "border-gray-900 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: option.value }}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color: option.value }))
                  }
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Platform hakkında kısa açıklama..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="isActive" className="font-medium">
                Aktif Platform
              </Label>
              <p className="text-sm text-gray-500">
                Pasif platformlar ürün eklerken görünmez
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

