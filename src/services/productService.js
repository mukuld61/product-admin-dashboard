import api from "@/lib/axios";

// The list only needs these fields, so ask the API for just them (smaller response)
const LIST_FIELDS = "title,thumbnail,category,price,rating,stock";

// GET /products?limit=&skip=  ->  { products, total }
// `signal` lets the caller cancel the request (used by the hook below).
export async function getProducts({ limit, skip, signal }) {
  const { data } = await api.get("/products", {
    params: { limit, skip, select: LIST_FIELDS },
    signal,
  });
  return { products: data.products, total: data.total };
}
