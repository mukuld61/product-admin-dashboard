"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { isCancel } from "@/lib/axios";

// Fetches one page of products for the given query/category/sort/pagination.
// Handles loading, error, retry, and cancelling stale requests.
export default function useProducts({ q, category, limit, skip }) {
  const [attempt, setAttempt] = useState(0); // bumped by retry() to refetch
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  // Identifies "which request is the current one". Any param change makes a new key.
  const key = `${q}:${category}:${limit}:${skip}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ q, category, limit, skip, signal: controller.signal })
      .then((data) => setResult({ key, data, error: "" }))
      .catch((err) => {
        if (isCancel(err)) return; // we cancelled it ourselves: not an error
        setResult({ key, data: null, error: err.message });
      });

    // Runs when inputs change or the page unmounts: cancel the previous request.
    // This is what guarantees a fast typist never sees an old result land after a new one.
    return () => controller.abort();
  }, [key, q, category, limit, skip]);

  // A stored result only counts if it belongs to the current request.
  const isCurrent = result.key === key;

  return {
    loading: !isCurrent,
    error: isCurrent ? result.error : "",
    data: isCurrent ? result.data : null,
    retry: () => setAttempt((n) => n + 1),
  };
}
