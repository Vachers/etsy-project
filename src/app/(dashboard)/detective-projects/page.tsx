"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockDetectiveProjects } from "@/lib/mock-data";

export default function DetectiveProjectsPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/detective-projects/new");
  };

  const handleView = (product: Product) => {
    router.push(`/detective-projects/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/detective-projects/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Detective Projects"
      description="Dedektif projelerinizi yönetin"
      category="detective-projects"
      products={mockDetectiveProjects}
      basePath="/detective-projects"
      icon={<Search className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
