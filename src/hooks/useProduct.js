"use client";

import { useEffect, useState } from "react";
import { getProduct } from "@/services/productService";
import { isCancel } from "@/lib/axios";

// Fetches a single product by id. Distinguishes "not found" (404, or 401 for
// a malformed id -- see productService) from other errors, so the page can
// show a dedicated not-found state vs. a Retry box.
export default function useProduct(id) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ loading: true, product: null, notFound: false, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, product: null, notFound: false, error: "" });

    getProduct(id, { signal: controller.signal })
      .then((product) => setState({ loading: false, product, notFound: false, error: "" }))
      .catch((err) => {
        if (isCancel(err)) return;
        if (err.status === 404 || err.status === 401 || err.status === 400) {
          setState({ loading: false, product: null, notFound: true, error: "" });
        } else {
          setState({ loading: false, product: null, notFound: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [id, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
