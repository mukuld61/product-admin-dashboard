import api from "@/lib/axios";

// The list only needs these fields, so ask the API for just them (smaller response)
const LIST_FIELDS = "title,thumbnail,category,price,rating,stock";

// GET /products?limit=&skip=  ->  { products, total }
function getAllProducts({ limit, skip, signal }) {
  return api
    .get("/products", { params: { limit, skip, select: LIST_FIELDS }, signal })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

// GET /products/category/{slug}?limit=&skip=  ->  { products, total }
function getProductsByCategory({ category, limit, skip, signal }) {
  return api
    .get(`/products/category/${encodeURIComponent(category)}`, {
      params: { limit, skip, select: LIST_FIELDS },
      signal,
    })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

// GET /products/search?q=&limit=&skip=  ->  { products, total }
function searchProducts({ q, limit, skip, signal }) {
  return api
    .get("/products/search", { params: { q, limit, skip, select: LIST_FIELDS }, signal })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

// Single entry point the hook calls. DummyJSON can't search and filter by
// category at once, so search takes priority when both are set (see README
// note: category is cleared in the UI the moment the user types a search).
export function getProducts({ q, category, limit, skip, signal }) {
  if (q) return searchProducts({ q, limit, skip, signal });
  if (category) return getProductsByCategory({ category, limit, skip, signal });
  return getAllProducts({ limit, skip, signal });
}

// GET /products/categories -> string[] (category slugs)
export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}
