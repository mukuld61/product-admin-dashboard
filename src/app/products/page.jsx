"use client";

import useProducts from "@/hooks/useProducts";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import { Loader, EmptyState, ErrorState } from "@/components/States";

// Fixed for now: the next step reads these from the URL.
const LIMIT = 10;
const SKIP = 0;

export default function ProductsPage() {
  const { data, loading, error, retry } = useProducts({ limit: LIMIT, skip: SKIP });

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (data.products.length === 0) return <EmptyState message="No products found." />;

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Products</h1>
      <p className="mb-4 mt-1 text-sm text-slate-600">
        Showing {SKIP + 1}-{SKIP + data.products.length} of {data.total}
      </p>
      <ProductTable products={data.products} />
      <ProductCards products={data.products} />
    </>
  );
}
