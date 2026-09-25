"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useProducts from "@/hooks/useProducts";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import useCategories from "@/hooks/useCategories";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import CategorySelect from "@/components/CategorySelect";
import SortSelect from "@/components/SortSelect";
import { Loader, EmptyState, ErrorState } from "@/components/States";
import { parsePage, parsePageSize, skipFor } from "@/lib/pagination";

const SORT_FIELDS = ["price", "rating", "title"];
const SORT_ORDERS = ["asc", "desc"];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = useCategories();

  const urlQuery = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  // Bad/unknown sort values are dropped rather than sent to the API as-is.
  const rawSortBy = searchParams.get("sortBy");
  const rawOrder = searchParams.get("order");
  const sortBy = SORT_FIELDS.includes(rawSortBy) ? rawSortBy : "";
  const order = sortBy && SORT_ORDERS.includes(rawOrder) ? rawOrder : "";

  const [inputValue, setInputValue] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(inputValue, 400);

  const { data, loading, error, retry } = useProducts({
    q: debouncedQuery,
    category,
    sortBy,
    order,
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

  // Push debounced search into the URL (must run in an effect, not during render).
  // Search and category are mutually exclusive (the API can't combine them), so
  // typing a search term always clears any active category filter too.
  useEffect(() => {
    if (debouncedQuery !== urlQuery) {
      updateUrl({ q: debouncedQuery, category: "", page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function handleSearchInput(next) {
    setInputValue(next);
  }

  // DummyJSON can't search and filter by category in the same request, so the
  // UI keeps them mutually exclusive: picking a category clears the search box.
  function handleCategoryChange(nextCategory) {
    setInputValue("");
    updateUrl({ category: nextCategory, q: "", page: 1 });
  }

  function handleSortChange({ sortBy: nextSortBy, order: nextOrder }) {
    updateUrl({ sortBy: nextSortBy, order: nextOrder, page: 1 });
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

      <div className="mt-4 mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={inputValue} onChange={handleSearchInput} />
        <CategorySelect categories={categories} value={category} onChange={handleCategoryChange} />
        <SortSelect sortBy={sortBy} order={order} onChange={handleSortChange} />
      </div>

      {category && (
        <p className="mb-3 text-sm text-slate-600">
          Filtering by <span className="font-medium capitalize">{category.replace(/-/g, " ")}</span>.
          Search is disabled while a category filter is active — type in the search box to clear it.
        </p>
      )}

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
