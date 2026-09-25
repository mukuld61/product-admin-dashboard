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
function searchProducts({ q, limit, skip, sortBy, order, signal }) {
  return api
    .get("/products/search", { params: { q, limit, skip, select: LIST_FIELDS, sortBy, order }, signal })
    .then(({ data }) => ({ products: data.products, total: data.total }));
}

export function getProducts({ q, category, sortBy, order, limit, skip, signal }) {
  if (q) return searchProducts({ q, limit, skip, sortBy, order, signal });
  if (category) return getProductsByCategory({ category, limit, skip, sortBy, order, signal });
  return getAllProducts({ limit, skip, sortBy, order, signal });
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}

// skipAuthRedirect: true because DummyJSON can return a 401 for a malformed
// id (e.g. "abc"), and that must show our not-found state, not log the user out.
export async function getProduct(id, { signal } = {}) {
  const { data } = await api.get(`/products/${encodeURIComponent(id)}`, {
    signal,
    skipAuthRedirect: true,
  });
  return data;
}

// --- Write endpoints ---
// DummyJSON's add/edit/delete are simulated: they respond with a 200/201 and
// a plausible-looking object, but nothing is actually persisted server-side.
// We still call them (to genuinely exercise the API, since the assignment
// asks for that), but the app's real source of truth for these changes is
// the local overlay in productOverlay.js -- see the README note on this.

// POST /products/add
export async function createProduct(fields) {
  await api.post("/products/add", fields);
}

// PUT /products/{id}
export async function updateProduct(id, fields) {
  await api.put(`/products/${id}`, fields);
}

// DELETE /products/{id}
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}
