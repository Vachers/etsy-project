"use client";

import { Code } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import { useRouter } from "next/navigation";
import { mockScriptsProducts } from "@/lib/mock-data";

export default function ScriptsPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/scripts/new");
  };

  const handleView = (product: (typeof mockScriptsProducts)[0]) => {
    router.push(`/scripts/${product.id}`);
  };

  const handleEdit = (product: (typeof mockScriptsProducts)[0]) => {
    router.push(`/scripts/${product.id}/edit`);
  };

  const handleDelete = (product: (typeof mockScriptsProducts)[0]) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Scripts"
      description="Kod scriptleri ve otomasyon araçlarınızı yönetin"
      category="scripts"
      products={mockScriptsProducts}
      icon={<Code className="h-5 w-5 text-emerald-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}


