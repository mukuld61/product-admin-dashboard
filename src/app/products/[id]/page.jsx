"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useProduct from "@/hooks/useProduct";
import { deleteProduct } from "@/services/productService";
import { deleteOverlayProduct } from "@/lib/productOverlay";
import ProductGallery from "@/components/ProductGallery";
import StarRating from "@/components/StarRating";
import ReviewList from "@/components/ReviewList";
import ConfirmDialog from "@/components/ConfirmDialog";
import NotFound from "./not-found";
import { Loader, ErrorState } from "@/components/States";
import { formatCategory, formatPrice, formatStock } from "@/lib/format";

export default function ProductDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { loading, product, notFound, error, retry } = useProduct(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteProduct(id).catch(() => {}); // fake endpoint; ignore failure either way
    deleteOverlayProduct(Number(id));
    router.push("/products");
  }

  if (loading) return <Loader />;
  if (notFound) return <NotFound />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  const discount = product.discountPercentage
    ? Math.round(product.price / (1 - product.discountPercentage / 100) * 100) / 100
    : null;

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/products" className="text-sm text-teal-700 hover:underline">
          &larr; Back to products
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/products/${id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Edit
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <p className="text-sm capitalize text-slate-500">{formatCategory(product.category)}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{product.title}</h1>

          <div className="mt-2">
            <StarRating rating={product.rating} />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{formatPrice(product.price)}</span>
            {discount && (
              <span className="text-sm text-slate-400 line-through">{formatPrice(discount)}</span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-600">{formatStock(product.stock)}</p>

          <p className="mt-4 leading-relaxed text-slate-700">{product.description}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <div className="mt-4">
          <ReviewList reviews={product.reviews} />
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this product?"
        message={`This will remove "${product.title}" from your view. This can't be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
