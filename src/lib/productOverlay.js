// DummyJSON's add/edit/delete endpoints don't actually persist anything --
// each call succeeds and returns a plausible response, but the underlying
// data never changes. So we keep a small local "overlay" of our own edits,
// stored in localStorage, and merge it into every list/detail response.
//
// Overlay shape:
//   added:   { [ourId]: product }        -- products we created
//   edited:  { [id]: partialFields }     -- field overrides for existing products
//   deleted: [id, id, ...]               -- ids to hide
//
// New products get ids starting at 100000 so they never collide with
// DummyJSON's real ids (1-194).

const KEY = "product-overlay-v1";
let nextNewId = 100000;

function read() {
  if (typeof window === "undefined") return { added: {}, edited: {}, deleted: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { added: {}, edited: {}, deleted: [] };
    const parsed = JSON.parse(raw);
    const ids = Object.keys(parsed.added || {}).map(Number);
    if (ids.length) nextNewId = Math.max(nextNewId, ...ids) + 1;
    return { added: parsed.added || {}, edited: parsed.edited || {}, deleted: parsed.deleted || [] };
  } catch {
    return { added: {}, edited: {}, deleted: [] }; // corrupted storage: start clean rather than crash
  }
}

function write(overlay) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(overlay));
  } catch {
    // localStorage can fail (quota, private mode) -- the app still works,
    // it just won't remember fake changes across a refresh.
  }
}

export function addOverlayProduct(fields) {
  const overlay = read();
  const id = nextNewId++;
  const product = { id, reviews: [], images: fields.thumbnail ? [fields.thumbnail] : [], ...fields };
  overlay.added[id] = product;
  write(overlay);
  return product;
}

export function editOverlayProduct(id, fields) {
  const overlay = read();
  if (overlay.added[id]) {
    overlay.added[id] = { ...overlay.added[id], ...fields };
  } else {
    overlay.edited[id] = { ...(overlay.edited[id] || {}), ...fields };
  }
  write(overlay);
}

export function deleteOverlayProduct(id) {
  const overlay = read();
  if (overlay.added[id]) {
    delete overlay.added[id]; // never existed on the server -- just forget it
  } else if (!overlay.deleted.includes(id)) {
    overlay.deleted.push(id);
  }
  write(overlay);
}

// Applies the overlay to a list response: drops deleted ids, applies edits,
// and appends locally-added products (put first so they're easy to spot).
export function applyOverlayToList({ products, total }) {
  const overlay = read();
  const addedList = Object.values(overlay.added);

  const merged = products
    .filter((p) => !overlay.deleted.includes(p.id))
    .map((p) => (overlay.edited[p.id] ? { ...p, ...overlay.edited[p.id] } : p));

  return {
    products: [...addedList, ...merged],
    total: total + addedList.length - (products.length - merged.length),
  };
}

// Applies the overlay to a single product response (details page).
export function applyOverlayToProduct(product) {
  const overlay = read();
  if (!product) return product;
  if (overlay.deleted.includes(product.id)) return null;
  return overlay.edited[product.id] ? { ...product, ...overlay.edited[product.id] } : product;
}

// Looks up a locally-added product by id (details page needs this because
// GET /products/{id} for a fake id would 404 against the real API).
export function getOverlayAddedProduct(id) {
  const overlay = read();
  return overlay.added[id] || null;
}

export function isLocallyAddedId(id) {
  return Number(id) >= 100000;
}
