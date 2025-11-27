"use client";

import { useState } from "react";
import { Plus, Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid, Product, ProductCategory } from "./product-card";

interface ProductPageLayoutProps {
  title: string;
  description: string;
  category: ProductCategory;
  products: Product[];
  basePath?: string;
  icon?: React.ReactNode;
  onAddNew?: () => void;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductPageLayout({
  title,
  description,
  category,
  products,
  basePath = "/ebooks",
  icon,
  onAddNew,
  onView,
  onEdit,
  onDelete,
}: ProductPageLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Merge "active" and "selling" into "selling" filter
    let matchesStatus = statusFilter === "all";
    if (statusFilter === "selling") {
      matchesStatus = product.status === "active" || product.status === "selling";
    } else if (statusFilter !== "all") {
      matchesStatus = product.status === statusFilter;
    }
    
    const matchesCategory = product.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: filteredProducts.length,
    active: filteredProducts.filter((p) => p.status === "active" || p.status === "selling").length,
    draft: filteredProducts.filter((p) => p.status === "draft").length,
    archived: filteredProducts.filter((p) => p.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        <Button
          onClick={onAddNew}
          className="gap-2 bg-gradient-primary hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-card-border bg-white p-4">
          <p className="text-sm text-gray-500">Toplam Ürün</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-card-border bg-white p-4">
          <p className="text-sm text-gray-500">Satışta</p>
          <p className="text-2xl font-bold text-success-600">{stats.active}</p>
        </div>
        <div className="rounded-lg border border-card-border bg-white p-4">
          <p className="text-sm text-gray-500">Taslak</p>
          <p className="text-2xl font-bold text-warning-600">{stats.draft}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Ürün ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="selling">Satışta</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
            <SelectItem value="archived">Arşivlenmiş</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtreler
        </Button>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        basePath={basePath}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyMessage={`Henüz ${title.toLowerCase()} eklenmemiş`}
      />
    </div>
  );
}

