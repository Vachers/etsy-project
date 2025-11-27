"use client";

import { useRouter } from "next/navigation";
import { Boxes } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockDigitalBundles } from "@/lib/mock-data";

export default function DigitalBundlesPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/digital-bundles/new");
  };

  const handleView = (product: Product) => {
    router.push(`/digital-bundles/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/digital-bundles/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Digital Bundles"
      description="Paket ürünlerinizi yönetin"
      category="digital-bundles"
      products={mockDigitalBundles}
      basePath="/digital-bundles"
      icon={<Boxes className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
