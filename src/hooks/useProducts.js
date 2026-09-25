"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { isCancel } from "@/lib/axios";
import { applyOverlayToList } from "@/lib/productOverlay";

// Fetches one page of products for the given query/category/sort/pagination.
// Handles loading, error, retry, cancelling stale requests, and merges in
// the local overlay (fake add/edit/delete) before handing data back.
export default function useProducts({ q, category, sortBy, order, limit, skip }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  const key = `${q}:${category}:${sortBy}:${order}:${limit}:${skip}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ q, category, sortBy, order, limit, skip, signal: controller.signal })
      .then((data) => setResult({ key, data: applyOverlayToList(data), error: "" }))
      .catch((err) => {
        if (isCancel(err)) return;
        setResult({ key, data: null, error: err.message });
      });

    return () => controller.abort();
  }, [key, q, category, sortBy, order, limit, skip]);

  const isCurrent = result.key === key;

  return {
    loading: !isCurrent,
    error: isCurrent ? result.error : "",
    data: isCurrent ? result.data : null,
    retry: () => setAttempt((n) => n + 1),
  };
}
