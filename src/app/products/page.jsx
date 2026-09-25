"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useProducts from "@/hooks/useProducts";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import Pagination from "@/components/Pagination";
import { Loader, EmptyState, ErrorState } from "@/components/States";
import { parsePage, parsePageSize, skipFor } from "@/lib/pagination";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // pageSize doesn't depend on "total", so it's safe to parse first
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  const { data, loading, error, retry } = useProducts({
    // Before the first response, "total" is unknown, so page is used as-is
    // (parsePage only clamps once total is known -- see below).
    limit: pageSize,
    skip: skipFor(parsePage(searchParams.get("page"), { pageSize, total: null }), pageSize),
  });

  // Now that we may know the total, re-derive the *real* current page.
  // If the URL asked for page 999 and there are only 20 pages, this clamps
  // to 20 -- but only once "total" has actually loaded.
  const page = parsePage(searchParams.get("page"), { pageSize, total: data?.total ?? null });

  function updateUrl({ nextPage, nextPageSize }) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    params.set("pageSize", String(nextPageSize));
    router.push(`/products?${params.toString()}`);
  }

  function handlePageChange(nextPage) {
    updateUrl({ nextPage, nextPageSize: pageSize });
  }

  function handlePageSizeChange(nextPageSize) {
    // Changing page size restarts at page 1 -- old skip offset no longer makes sense
    updateUrl({ nextPage: 1, nextPageSize });
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (data.products.length === 0) return <EmptyState message="No products found." />;

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Products</h1>
      <div className="mt-1">
        <ProductTable products={data.products} />
        <ProductCards products={data.products} />
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={data.total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
