"use client";

import { use } from "react";
import Link from "next/link";
import useProduct from "@/hooks/useProduct";
import ProductGallery from "@/components/ProductGallery";
import StarRating from "@/components/StarRating";
import ReviewList from "@/components/ReviewList";
import NotFound from "./not-found";
import { Loader, ErrorState } from "@/components/States";
import { formatCategory, formatPrice, formatStock } from "@/lib/format";

export default function ProductDetailsPage({ params }) {
  // Next.js 15+ passes `params` as a Promise in Client Components; `use()` unwraps it.
  const { id } = use(params);
  const { loading, product, notFound, error, retry } = useProduct(id);

  if (loading) return <Loader />;
  if (notFound) return <NotFound />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  const discount = product.discountPercentage
    ? Math.round(product.price / (1 - product.discountPercentage / 100) * 100) / 100
    : null;

  return (
    <>
      <Link href="/products" className="text-sm text-teal-700 hover:underline">
        &larr; Back to products
      </Link>

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
    </>
  );
}
