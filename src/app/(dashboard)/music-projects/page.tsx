"use client";

import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockMusicProjects } from "@/lib/mock-data";

export default function MusicProjectsPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/music-projects/new");
  };

  const handleView = (product: Product) => {
    router.push(`/music-projects/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/music-projects/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Music Projects"
      description="Müzik projelerinizi yönetin"
      category="music-projects"
      products={mockMusicProjects}
      basePath="/music-projects"
      icon={<Music className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
