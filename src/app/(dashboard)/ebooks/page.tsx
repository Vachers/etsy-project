"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockEbooks } from "@/lib/mock-data";

export default function EbooksPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/ebooks/new");
  };

  const handleView = (product: Product) => {
    router.push(`/ebooks/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/ebooks/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
    // TODO: Silme işlemi için API çağrısı yapılacak
  };

  return (
    <ProductPageLayout
      title="E-books"
      description="Dijital kitap projelerinizi yönetin"
      category="ebooks"
      products={mockEbooks}
      basePath="/ebooks"
      icon={<BookOpen className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
