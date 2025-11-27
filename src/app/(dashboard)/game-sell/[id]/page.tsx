"use client";

import { useParams, useRouter } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockProductById } from "@/lib/mock-data";
import { ProductDetailPage } from "@/components/common/product-detail-page";

export default function GameSellDetailPage() {
  const params = useParams();
  const router = useRouter();

  const product = getMockProductById(params.id as string);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Gamepad2 className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Ürün bulunamadı</h2>
        <p className="text-gray-500 mt-2">Bu ID ile eşleşen bir ürün yok.</p>
        <Button onClick={() => router.push("/game-sell")} className="mt-4">
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      basePath="/game-sell"
      icon={<Gamepad2 className="h-4 w-4 text-primary-600" />}
      categoryLabel="Oyun Satışı"
    />
  );
}

