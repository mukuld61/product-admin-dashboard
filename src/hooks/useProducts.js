"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { isCancel } from "@/lib/axios";

// Fetches one page of products. Handles loading, error, retry and cancelling.
export default function useProducts({ limit, skip }) {
  const [attempt, setAttempt] = useState(0); // bumped by retry() to refetch
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  // Identifies "which request is the current one"
  const key = `${limit}:${skip}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ limit, skip, signal: controller.signal })
      .then((data) => setResult({ key, data, error: "" }))
      .catch((err) => {
        if (isCancel(err)) return; // we cancelled it ourselves: not an error
        setResult({ key, data: null, error: err.message });
      });

    // Runs when inputs change or the page unmounts: cancel the old request
    return () => controller.abort();
  }, [key, limit, skip]);

  // A stored result only counts if it belongs to the current request.
  // Otherwise we are still loading, so an old result can never show up as new.
  const isCurrent = result.key === key;

  return {
    loading: !isCurrent,
    error: isCurrent ? result.error : "",
    data: isCurrent ? result.data : null,
    retry: () => setAttempt((n) => n + 1),
  };
}
