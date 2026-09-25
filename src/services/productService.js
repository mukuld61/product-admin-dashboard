import api from "@/lib/axios";

// The list only needs these fields, so ask the API for just them (smaller response)
const LIST_FIELDS = "title,thumbnail,category,price,rating,stock";

// GET /products?limit=&skip=&sortBy=&order=  ->  { products, total }
function getAllProducts({ limit, skip, sortBy, order, signal }) {
  return api
    .get("/products", { params: { limit, skip, select: LIST_FIELDS, sortBy, order }, signal })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

// GET /products/category/{slug}?limit=&skip=&sortBy=&order=  ->  { products, total }
function getProductsByCategory({ category, limit, skip, sortBy, order, signal }) {
  return api
    .get(`/products/category/${encodeURIComponent(category)}`, {
      params: { limit, skip, select: LIST_FIELDS, sortBy, order },
      signal,
    })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

// GET /products/search?q=&limit=&skip=&sortBy=&order=  ->  { products, total }
// Note: DummyJSON's /search endpoint accepts sortBy/order too, but NOT category
// at the same time -- that's why category+search are mutually exclusive in the UI.
function searchProducts({ q, limit, skip, sortBy, order, signal }) {
  return api
    .get("/products/search", { params: { q, limit, skip, select: LIST_FIELDS, sortBy, order }, signal })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

// Single entry point the hook calls. Search takes priority over category when
// both are somehow set, but the UI (see page.jsx) prevents that combination
// by clearing one whenever the other is set.
export function getProducts({ q, category, sortBy, order, limit, skip, signal }) {
  if (q) return searchProducts({ q, limit, skip, sortBy, order, signal });
  if (category) return getProductsByCategory({ category, limit, skip, sortBy, order, signal });
  return getAllProducts({ limit, skip, sortBy, order, signal });
}

// GET /products/categories -> string[] (category slugs)
export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}
