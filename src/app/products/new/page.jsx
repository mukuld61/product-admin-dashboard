"use client";

import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productService";
import { addOverlayProduct } from "@/lib/productOverlay";
import useCategories from "@/hooks/useCategories";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const categories = useCategories();

  async function handleSubmit(fields) {
    // Call the real endpoint too (exercises the API), but its response is
    // not what we trust -- see the note in productService.js. The overlay
    // is what actually makes the new product show up and stick around.
    await createProduct(fields).catch(() => {}); // fake endpoint; ignore failure either way
    const product = addOverlayProduct(fields);
    router.push(`/products/${product.id}`);
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Add product</h1>
      <p className="mt-1 text-sm text-slate-600">
        This demo API doesn&apos;t really save new products, so this one is kept locally in your browser.
      </p>
      <div className="mt-6">
        <ProductForm categories={categories} onSubmit={handleSubmit} submitLabel="Add product" />
      </div>
    </>
  );
}
