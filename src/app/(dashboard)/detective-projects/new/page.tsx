"use client";

import { ProductForm } from "@/components/forms/product-form";
import { SearchCode } from "lucide-react";

export default function NewDetectiveProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          <SearchCode className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Yeni Dedektif Projesi Ekle
          </h1>
          <p className="text-sm text-gray-500">
            Dedektif projenizi oluşturun
          </p>
        </div>
      </div>

      <ProductForm
        category="DETECTIVE_PROJECTS"
        categoryLabel="Detective Projects"
      />
    </div>
  );
}

