"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/services/productService";

// Categories rarely change, so this is fetched once and doesn't need
// cancellation/retry machinery the way the product list does.
export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((list) => { if (!cancelled) setCategories(list); })
      .catch(() => { if (!cancelled) setCategories([]); }); // fail quietly: filter is optional
    return () => { cancelled = true; };
  }, []);

  return categories;
}
