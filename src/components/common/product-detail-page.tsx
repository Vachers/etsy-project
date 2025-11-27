"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "./product-card";

interface ProductDetailPageProps {
  product: Product;
  basePath: string;
  icon: React.ReactNode;
  categoryLabel: string;
}

const statusConfig = {
  active: { label: "Aktif", className: "bg-success-100 text-success-800 border-success-200" },
  draft: { label: "Taslak", className: "bg-warning-100 text-warning-800 border-warning-200" },
  selling: { label: "Satışta", className: "bg-secondary-100 text-secondary-800 border-secondary-200" },
  archived: { label: "Arşivlenmiş", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function ProductDetailPage({
  product,
  basePath,
  icon,
  categoryLabel,
}: ProductDetailPageProps) {
  const router = useRouter();
  const status = statusConfig[product.status] || statusConfig.draft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(basePath)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              <Badge variant="outline" className={cn("border", status.className)}>
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`${basePath}/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Thumbnail & Basic Info */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-4">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                {icon}
              </div>
              <span className="text-sm font-medium text-gray-600">{categoryLabel}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Oluşturulma</span>
                <span className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Son Güncelleme</span>
                <span className="font-medium">
                  {new Date(product.updatedAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Satış İstatistikleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-secondary-50 p-4 border border-secondary-200">
                <div className="flex items-center gap-2 text-secondary-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Toplam Satış</span>
                </div>
                <p className="text-2xl font-bold text-secondary-700">
                  {product.totalSales || 0}
                </p>
              </div>
              <div className="rounded-lg bg-primary-50 p-4 border border-primary-200">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Toplam Gelir</span>
                </div>
                <p className="text-2xl font-bold text-primary-700">
                  {formatCurrency(product.totalRevenue || 0, "USD")}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Platform Sayısı</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {product.listings?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Listeleri</CardTitle>
        </CardHeader>
        <CardContent>
          {product.listings && product.listings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: listing.platform.color }}
                        >
                          {listing.platform.name.charAt(0)}
                        </div>
                        <span className="font-medium">{listing.platform.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-secondary-600">
                      {formatCurrency(Number(listing.price), listing.currency)}
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
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Görüntüle
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Henüz platform listesi eklenmemiş</p>
              <Button variant="outline" className="mt-4">
                Platform Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

