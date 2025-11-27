"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Music, Loader2 } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";

export default function MusicProjectsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?category=music-projects");
        if (res.ok) {
          const data = await res.json();
          const transformedProducts: Product[] = (data.data || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || "",
            thumbnail: p.thumbnail || "",
            category: "music-projects",
            status: p.status?.toLowerCase() || "draft",
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            platforms: p.listings?.map((l: any) => l.platform?.name) || [],
            totalSales: p.totalSales || 0,
            totalRevenue: p.totalRevenue || 0,
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Music projects yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    router.push("/music-projects/new");
  };

  const handleView = (product: Product) => {
    router.push(`/music-projects/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/music-projects/${product.id}/edit`);
  };

  const handleDelete = async (product: Product) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
        if (res.ok) {
          setProducts(products.filter((p) => p.id !== product.id));
        }
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <ProductPageLayout
      title="Music Projects"
      description="Müzik projelerinizi yönetin"
      category="music-projects"
      products={products}
      basePath="/music-projects"
      icon={<Music className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
