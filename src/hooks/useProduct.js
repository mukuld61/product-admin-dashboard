"use client";

import { useEffect, useState } from "react";
import { getProduct } from "@/services/productService";
import { isCancel } from "@/lib/axios";
import { applyOverlayToProduct, getOverlayAddedProduct, isLocallyAddedId } from "@/lib/productOverlay";

// Fetches a single product by id, merging in any local overlay edits.
// A locally-added id (>= 100000) never exists on the real API, so it's
// read straight from the overlay instead of making a doomed network call.
export default function useProduct(id) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ loading: true, product: null, notFound: false, error: "" });

  useEffect(() => {
    if (isLocallyAddedId(id)) {
      const product = getOverlayAddedProduct(id);
      setState(
        product
          ? { loading: false, product, notFound: false, error: "" }
          : { loading: false, product: null, notFound: true, error: "" }
      );
      return;
    }

    const controller = new AbortController();
    setState({ loading: true, product: null, notFound: false, error: "" });

    getProduct(id, { signal: controller.signal })
      .then((product) => {
        const merged = applyOverlayToProduct(product);
        setState(
          merged
            ? { loading: false, product: merged, notFound: false, error: "" }
            : { loading: false, product: null, notFound: true, error: "" } // overlay-deleted
        );
      })
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
