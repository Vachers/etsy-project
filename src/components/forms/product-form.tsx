"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  X,
  ImageIcon,
  Store,
  Globe,
} from "lucide-react";
import { salesPlatforms } from "@/lib/platforms";

interface Platform {
  id: string;
  name: string;
  slug: string;
  color: string;
  commissionRate: number;
  defaultCurrency: string;
  isActive: boolean;
}

interface SalesAccount {
  id: string;
  name: string;
  platformId: string;
  shopName?: string;
  isActive: boolean;
  isDefault: boolean;
}

interface PlatformListing {
  platformId: string;
  salesAccountId?: string;
  price: number;
  currency: string;
  productUrl: string;
  status: string;
}

interface ProductFormData {
  title: string;
  description: string;
  thumbnail: string;
  thumbnailFile?: File | null;
  category: string;
  status: string;
  downloadUrl: string;
  fileSize: string;
  tags: string[];
  listings: PlatformListing[];
}

interface ProductFormProps {
  category: string;
  categoryLabel: string;
  productId?: string;
  initialData?: ProductFormData;
}

const categoryOptions = [
  { value: "EBOOKS", label: "E-books" },
  { value: "DIGITAL_PRODUCTS", label: "Digital Products" },
  { value: "DIGITAL_BUNDLES", label: "Digital Bundles" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "DETECTIVE_PROJECTS", label: "Detective Projects" },
  { value: "MUSIC_PROJECTS", label: "Music Projects" },
  { value: "GAME_SELL", label: "Game Sell" },
];

const statusOptions = [
  { value: "DRAFT", label: "Taslak" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "SELLING", label: "Satışta" },
  { value: "ARCHIVED", label: "Arşivlenmiş" },
];

const listingStatusOptions = [
  { value: "DRAFT", label: "Taslak" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "SELLING", label: "Satışta" },
  { value: "PAUSED", label: "Duraklatılmış" },
  { value: "ARCHIVED", label: "Arşivlenmiş" },
];

const currencies = [
  { value: "TRY", label: "₺ TRY", symbol: "₺" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
  { value: "GBP", label: "£ GBP", symbol: "£" },
];

// Mock satış hesapları - gerçek uygulamada API'den gelecek
const mockSalesAccounts: SalesAccount[] = [
  { id: "1", name: "Ana Etsy Dükkanım", platformId: "etsy", shopName: "DigitalDesignsShop", isActive: true, isDefault: true },
  { id: "2", name: "İkinci Etsy Dükkanı", platformId: "etsy", shopName: "PrintableArtStore", isActive: true, isDefault: false },
  { id: "3", name: "Gumroad Ana Hesap", platformId: "gumroad", shopName: "CreativeAssets", isActive: true, isDefault: true },
  { id: "4", name: "Amazon KDP Hesabı", platformId: "amazon-kdp", isActive: true, isDefault: true },
  { id: "5", name: "Creative Market Shop", platformId: "creative-market", shopName: "DesignStudio", isActive: true, isDefault: true },
];

export function ProductForm({
  category,
  categoryLabel,
  productId,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;
  const [loading, setLoading] = useState(false);
  const [platforms] = useState<Platform[]>(
    salesPlatforms.map((p, index) => ({
      id: p.slug,
      name: p.name,
      slug: p.slug,
      color: p.color,
      commissionRate: p.commissionRate,
      defaultCurrency: p.defaultCurrency,
      isActive: true,
    }))
  );
  const [salesAccounts] = useState<SalesAccount[]>(mockSalesAccounts);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailType, setThumbnailType] = useState<"url" | "upload">("url");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail || "",
    thumbnailFile: null,
    category: initialData?.category || category,
    status: initialData?.status || "DRAFT",
    downloadUrl: initialData?.downloadUrl || "",
    fileSize: initialData?.fileSize || "",
    tags: initialData?.tags || [],
    listings: initialData?.listings || [],
  });

  // Set initial thumbnail preview
  useEffect(() => {
    if (formData.thumbnail) {
      setThumbnailPreview(formData.thumbnail);
    }
  }, []);

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, thumbnail: url, thumbnailFile: null }));
    setThumbnailPreview(url);
  };

  const clearThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "", thumbnailFile: null }));
    setThumbnailPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addPlatformListing = (platformSlug: string) => {
    const platform = platforms.find((p) => p.slug === platformSlug);
    if (!platform) return;

    // Check if already added
    if (formData.listings.some((l) => l.platformId === platformSlug)) {
      return;
    }

    // Find default sales account for this platform
    const defaultAccount = salesAccounts.find(
      (a) => a.platformId === platformSlug && a.isDefault && a.isActive
    );

    setFormData((prev) => ({
      ...prev,
      listings: [
        ...prev.listings,
        {
          platformId: platformSlug,
          salesAccountId: defaultAccount?.id || "",
          price: 0,
          currency: platform.defaultCurrency,
          productUrl: "",
          status: "DRAFT",
        },
      ],
    }));
  };

  const removePlatformListing = (platformId: string) => {
    setFormData((prev) => ({
      ...prev,
      listings: prev.listings.filter((l) => l.platformId !== platformId),
    }));
  };

  const updateListing = (
    platformId: string,
    field: keyof PlatformListing,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      listings: prev.listings.map((l) =>
        l.platformId === platformId ? { ...l, [field]: value } : l
      ),
    }));
  };

  const getAccountsForPlatform = (platformId: string) => {
    return salesAccounts.filter(
      (a) => a.platformId === platformId && a.isActive
    );
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle file upload if there's a file
      let thumbnailUrl = formData.thumbnail;
      if (formData.thumbnailFile) {
        // In a real app, upload to cloud storage (Vercel Blob, AWS S3, etc.)
        // For now, we'll use the base64 preview or the file would be uploaded
        console.log("Would upload file:", formData.thumbnailFile.name);
        // thumbnailUrl = await uploadFile(formData.thumbnailFile);
        thumbnailUrl = thumbnailPreview; // Use preview for demo
      }

      const submitData = {
        ...formData,
        thumbnail: thumbnailUrl,
      };

      const url = isEditing ? `/api/products/${productId}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const categoryPath = category.toLowerCase().replace(/_/g, "-");
        router.push(`/${categoryPath}`);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Ürün kaydedilirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getPlatformById = (id: string) => platforms.find((p) => p.slug === id);

  const availablePlatforms = platforms.filter(
    (p) => !formData.listings.some((l) => l.platformId === p.slug)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Ürün Başlığı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ürün başlığını girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Ürün açıklamasını girin..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileSize">Dosya Boyutu</Label>
              <Input
                id="fileSize"
                value={formData.fileSize}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fileSize: e.target.value }))
                }
                placeholder="Örn: 25 MB"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail & Download */}
      <Card>
        <CardHeader>
          <CardTitle>Görsel ve Dosya</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Thumbnail Section */}
            <div className="space-y-3">
              <Label>Thumbnail</Label>
              <Tabs 
                value={thumbnailType} 
                onValueChange={(v) => setThumbnailType(v as "url" | "upload")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger 
                    value="url" 
                    className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upload"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="mt-3">
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-3">
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 border-dashed border-2 hover:border-primary-400 hover:bg-primary-50"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formData.thumbnailFile 
                            ? formData.thumbnailFile.name 
                            : "Dosya seçin veya sürükleyin"
                          }
                        </span>
                      </div>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <div className="relative mt-3">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg border bg-gray-50">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={clearThumbnail}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {!thumbnailPreview && (
                <div className="h-40 w-full rounded-lg border-2 border-dashed bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm">Önizleme için görsel ekleyin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Download URL */}
            <div className="space-y-3">
              <Label htmlFor="downloadUrl">İndirme URL</Label>
              <Input
                id="downloadUrl"
                value={formData.downloadUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    downloadUrl: e.target.value,
                  }))
                }
                placeholder="https://example.com/file.zip"
              />
              <p className="text-xs text-gray-500">
                Ürün dosyasının indirme linki
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Etiketler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Etiket ekle..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Platform Listeleri</CardTitle>
            {availablePlatforms.length > 0 && (
              <Select onValueChange={addPlatformListing}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="Platform ekle..." />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {availablePlatforms.map((platform) => (
                    <SelectItem key={platform.slug} value={platform.slug}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {formData.listings.length === 0 ? (
            <div className="flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed text-gray-400">
              <p>Henüz platform eklenmemiş</p>
              <p className="text-sm">Yukarıdan platform seçin</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.listings.map((listing) => {
                const platform = getPlatformById(listing.platformId);
                if (!platform) return null;
                const platformAccounts = getAccountsForPlatform(listing.platformId);

                return (
                  <div
                    key={listing.platformId}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm"
                          style={{ backgroundColor: platform.color }}
                        >
                          {platform.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-xs text-gray-500">
                            Komisyon: %{Number(platform.commissionRate).toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlatformListing(listing.platformId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Sales Account Selection */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          Satış Hesabı
                        </Label>
                        <Select
                          value={listing.salesAccountId || ""}
                          onValueChange={(value) =>
                            updateListing(listing.platformId, "salesAccountId", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Hesap seçin..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {platformAccounts.length === 0 ? (
                              <SelectItem value="" disabled>
                                Bu platform için hesap yok
                              </SelectItem>
                            ) : (
                              platformAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex items-center gap-2">
                                    {account.name}
                                    {account.isDefault && (
                                      <Badge variant="outline" className="text-xs py-0">
                                        Varsayılan
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label>Fiyat</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={listing.price}
                            onChange={(e) =>
                              updateListing(
                                listing.platformId,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="flex-1"
                          />
                          <Select
                            value={listing.currency}
                            onValueChange={(value) =>
                              updateListing(listing.platformId, "currency", value)
                            }
                          >
                            <SelectTrigger className="w-24 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {currencies.map((curr) => (
                                <SelectItem key={curr.value} value={curr.value}>
                                  {curr.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label>Durum</Label>
                        <Select
                          value={listing.status}
                          onValueChange={(value) =>
                            updateListing(listing.platformId, "status", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {listingStatusOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Product URL */}
                      <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                        <Label>Ürün Linki</Label>
                        <div className="flex gap-2">
                          <Input
                            value={listing.productUrl}
                            onChange={(e) =>
                              updateListing(
                                listing.platformId,
                                "productUrl",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                          />
                          {listing.productUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              asChild
                            >
                              <a
                                href={listing.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          İptal
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary-500 hover:bg-primary-600">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
