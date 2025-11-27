"use client";

import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockDigitalProducts } from "@/lib/mock-data";

export default function DigitalProductsPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/digital-products/new");
  };

  const handleView = (product: Product) => {
    router.push(`/digital-products/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/digital-products/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Digital Products"
      description="Dijital ürünlerinizi yönetin"
      category="digital-products"
      products={mockDigitalProducts}
      basePath="/digital-products"
      icon={<Package className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
