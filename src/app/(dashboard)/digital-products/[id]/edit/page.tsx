"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/forms/product-form";
import { getMockProductById } from "@/lib/mock-data";

export default function EditDigitalProductPage() {
  const params = useParams();
  const router = useRouter();
  const product = getMockProductById(params.id as string);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-gray-900">Ürün bulunamadı</h2>
        <Button onClick={() => router.push("/digital-products")} className="mt-4">
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push(`/digital-products/${params.id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünü Düzenle</h1>
          <p className="text-gray-500">{product.title}</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm
        category="digital-products"
        categoryLabel="Digital Products"
        productId={params.id as string}
        initialData={{
          title: product.title,
          description: product.description || "",
          thumbnail: product.thumbnail || "",
          category: "digital-products",
          status: product.status?.toUpperCase() || "DRAFT",
          downloadUrl: "",
          fileSize: "",
          tags: [],
          listings: product.listings?.map(l => ({
            platformId: l.platform.id,
            salesAccountId: undefined,
            price: l.price,
            currency: l.currency,
            productUrl: l.productUrl || "",
            status: l.status,
          })) || [],
        }}
      />
    </div>
  );
}


