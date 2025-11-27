"use client";

import { ProductForm } from "@/components/forms/product-form";
import { Package } from "lucide-react";

export default function NewDigitalProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          <Package className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Yeni Dijital Ürün Ekle
          </h1>
          <p className="text-sm text-gray-500">Dijital ürününüzü oluşturun</p>
        </div>
      </div>

      <ProductForm
        category="DIGITAL_PRODUCTS"
        categoryLabel="Digital Products"
      />
    </div>
  );
}

