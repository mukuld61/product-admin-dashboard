"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import useProduct from "@/hooks/useProduct";
import useCategories from "@/hooks/useCategories";
import { updateProduct } from "@/services/productService";
import { editOverlayProduct } from "@/lib/productOverlay";
import ProductForm from "@/components/ProductForm";
import NotFound from "../not-found";
import { Loader, ErrorState } from "@/components/States";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const categories = useCategories();
  const { loading, product, notFound, error, retry } = useProduct(id);

  async function handleSubmit(fields) {
    await updateProduct(id, fields).catch(() => {}); // fake endpoint; ignore failure either way
    editOverlayProduct(Number(id), fields);
    router.push(`/products/${id}`);
  }

  if (loading) return <Loader />;
  if (notFound) return <NotFound />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Edit product</h1>
      <p className="mt-1 text-sm text-slate-600">
        This demo API doesn&apos;t really save edits, so the change is kept locally in your browser.
      </p>
      <div className="mt-6">
        <ProductForm
          initialValues={product}
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </>
  );
}
