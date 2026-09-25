"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useProducts from "@/hooks/useProducts";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { Loader, EmptyState, ErrorState } from "@/components/States";
import { parsePage, parsePageSize, skipFor } from "@/lib/pagination";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  // The input shows every keystroke immediately; only the debounced value
  // below is what actually triggers a request and updates the URL.
  const [inputValue, setInputValue] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(inputValue, 400);

  const { data, loading, error, retry } = useProducts({
    q: debouncedQuery,
    category,
    limit: pageSize,
    skip: skipFor(parsePage(searchParams.get("page"), { pageSize, total: null }), pageSize),
  });

  const page = parsePage(searchParams.get("page"), { pageSize, total: data?.total ?? null });

  function updateUrl(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, val]) => {
      if (val) params.set(key, String(val));
      else params.delete(key);
    });
    router.push(`/products?${params.toString()}`);
  }

  // Once the debounce settles, push the new search into the URL and jump to page 1.
  // Must run in an effect, not during render: calling router.push() while
  // ProductsPage is rendering updates a different component (the router)
  // mid-render, which React forbids.
  useEffect(() => {
    if (debouncedQuery !== urlQuery) {
      updateUrl({ q: debouncedQuery, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function handleSearchInput(next) {
    setInputValue(next);
  }

  function handlePageChange(nextPage) {
    updateUrl({ page: nextPage });
  }

  function handlePageSizeChange(nextPageSize) {
    updateUrl({ pageSize: nextPageSize, page: 1 });
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Products</h1>

      <div className="mt-4 mb-4">
        <SearchBox value={inputValue} onChange={handleSearchInput} />
      </div>

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && data.products.length === 0 && (
        <EmptyState message="No products found." />
      )}
      {!loading && !error && data.products.length > 0 && (
        <>
          <ProductTable products={data.products} />
          <ProductCards products={data.products} />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={data.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </>
  );
}
