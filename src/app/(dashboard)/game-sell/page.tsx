"use client";

import { useRouter } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { ProductPageLayout } from "@/components/common";
import type { Product } from "@/components/common";
import { mockGameSell } from "@/lib/mock-data";

export default function GameSellPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/game-sell/new");
  };

  const handleView = (product: Product) => {
    router.push(`/game-sell/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/game-sell/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product.id);
  };

  return (
    <ProductPageLayout
      title="Game Sell"
      description="Oyun satışlarınızı yönetin"
      category="game-sell"
      products={mockGameSell}
      basePath="/game-sell"
      icon={<Gamepad2 className="h-5 w-5 text-primary-600" />}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
