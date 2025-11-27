"use client";

import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockSocialMedia } from "@/lib/mock-data";

export default function SocialMediaPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/social-media/new");
  };

  const handleView = (product: Product) => {
    router.push(`/social-media/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/social-media/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Social Media"
      description="Sosyal medya projelerinizi yönetin"
      category="social-media"
      products={mockSocialMedia}
      basePath="/social-media"
      icon={<Share2 className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
