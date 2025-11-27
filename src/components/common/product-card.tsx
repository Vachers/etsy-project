"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  ImageIcon,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ProductStatus = "active" | "draft" | "selling" | "archived";
export type ProductCategory = 
  | "ebooks" 
  | "digital-products" 
  | "digital-bundles" 
  | "social-media" 
  | "detective-projects" 
  | "music-projects" 
  | "game-sell"
  | "youtube"
  | "scripts";

export interface PlatformListing {
  id: string;
  price: number;
  currency: string;
  status: string;
  productUrl?: string;
  platform: {
    id: string;
    name: string;
    slug: string;
    color: string;
    commissionRate: number;
  };
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: ProductStatus;
  category: ProductCategory;
  listings?: PlatformListing[];
  totalSales?: number;
  totalRevenue?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: Product;
  basePath?: string;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  className?: string;
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: {
    label: "Aktif",
    className: "bg-success-100 text-success-800 border-success-200",
  },
  draft: {
    label: "Taslak",
    className: "bg-warning-100 text-warning-800 border-warning-200",
  },
  selling: {
    label: "Satışta",
    className: "bg-secondary-100 text-secondary-800 border-secondary-200",
  },
  archived: {
    label: "Arşivlenmiş",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const categoryConfig: Record<ProductCategory, { label: string; color: string }> = {
  "ebooks": { label: "E-book", color: "bg-blue-100 text-blue-700" },
  "digital-products": { label: "Dijital Ürün", color: "bg-purple-100 text-purple-700" },
  "digital-bundles": { label: "Paket", color: "bg-indigo-100 text-indigo-700" },
  "social-media": { label: "Sosyal Medya", color: "bg-pink-100 text-pink-700" },
  "detective-projects": { label: "Dedektif", color: "bg-amber-100 text-amber-700" },
  "music-projects": { label: "Müzik", color: "bg-rose-100 text-rose-700" },
  "game-sell": { label: "Oyun", color: "bg-cyan-100 text-cyan-700" },
  "youtube": { label: "Youtube", color: "bg-red-100 text-red-700" },
  "scripts": { label: "Script", color: "bg-emerald-100 text-emerald-700" },
};

export function ProductCard({
  product,
  basePath = "/ebooks",
  onView,
  onEdit,
  onDelete,
  className,
}: ProductCardProps) {
  const status = statusConfig[product.status] || statusConfig.draft;
  const category = categoryConfig[product.category] || categoryConfig.ebooks;

  // Calculate price range from listings
  const prices = product.listings?.map(l => Number(l.price)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const hasPriceRange = minPrice !== maxPrice;

  // Get primary currency (from first listing or default)
  const primaryCurrency = product.listings?.[0]?.currency || "TRY";

  return (
    <Card
      className={cn(
        "group overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 flex flex-col h-full",
        "hover:shadow-card-hover hover:border-primary-200",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageIcon className="h-12 w-12 text-gray-300" />
          </div>
        )}
        
        {/* Status Badge - Overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className={cn("border shadow-sm", status.className)}>
            {status.label}
          </Badge>
        </div>

        {/* Category Badge - Overlay */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className={cn("shadow-sm", category.color)}>
            {category.label}
          </Badge>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-9 p-0"
              onClick={() => onView?.(product)}
              asChild
            >
              <Link href={`${basePath}/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-9 p-0"
              onClick={() => onEdit?.(product)}
              asChild
            >
              <Link href={`${basePath}/${product.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Title and Description - Fixed height area */}
        <div className="flex items-start justify-between gap-2 min-h-[64px]">
          <div className="flex-1 min-w-0">
            <Link href={`${basePath}/${product.id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 transition-colors cursor-pointer">
                {product.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
              {product.description || "\u00A0"}
            </p>
          </div>
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`${basePath}/${product.id}`} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Görüntüle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${basePath}/${product.id}/edit`} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Düzenle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Önizle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(product)} 
                className="gap-2 text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Spacer to push bottom section down */}
        <div className="flex-1" />

        {/* Price & Stats - Aligned bottom section */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            {prices.length > 0 ? (
              <>
                <span className="text-lg font-bold text-secondary-600">
                  {formatCurrency(minPrice, primaryCurrency)}
                </span>
                {hasPriceRange && (
                  <span className="text-sm text-gray-400">
                    - {formatCurrency(maxPrice, primaryCurrency)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">Fiyat belirlenmedi</span>
            )}
          </div>
          {product.totalSales !== undefined && product.totalSales > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 text-secondary-500" />
              <span>{product.totalSales} satış</span>
            </div>
          )}
        </div>

        {/* Platform Badges - Always visible section */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 min-h-[44px]">
          {product.listings && product.listings.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              <TooltipProvider>
                {product.listings.slice(0, 4).map((listing) => (
                  <Tooltip key={listing.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded text-white text-xs font-bold cursor-pointer"
                        style={{ backgroundColor: listing.platform.color }}
                      >
                        {listing.platform.name.charAt(0)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{listing.platform.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatCurrency(Number(listing.price), listing.currency)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {product.listings.length > 4 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-600 text-xs font-medium cursor-pointer">
                        +{product.listings.length - 4}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{product.listings.length - 4} platform daha</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex items-center text-xs text-gray-400">
              Platform eklenmedi
            </div>
          )}
        </div>

        {/* Net Revenue - Always aligned at bottom */}
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
          <span className="text-gray-400">Net Gelir</span>
          <span className="font-semibold text-secondary-600">
            {product.totalRevenue !== undefined && product.totalRevenue > 0
              ? formatCurrency(product.totalRevenue, "TRY")
              : "₺0"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid component for product listings
interface ProductGridProps {
  products: Product[];
  basePath?: string;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function ProductGrid({
  products,
  basePath = "/ebooks",
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Henüz ürün eklenmemiş",
  emptyIcon,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {emptyIcon || <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />}
        <h3 className="text-lg font-medium text-gray-900">{emptyMessage}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Yeni ürün ekleyerek başlayın.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          basePath={basePath}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
