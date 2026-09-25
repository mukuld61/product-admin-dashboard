// Shared helpers so the URL is always the single source of truth for
// page + pageSize. Everything here is defensive: bad input never throws,
// it just falls back to something sane.

export const PAGE_SIZES = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

// "abc", "-3", "1.5", null -> fall back. Only a clean positive integer passes.
function parsePositiveInt(value, fallback) {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return fallback; // rejects "abc", "-3", "1.5", "1e3"
  const n = Number(value);
  return n > 0 ? n : fallback;
}

export function parsePageSize(raw) {
  const n = parsePositiveInt(raw, DEFAULT_PAGE_SIZE);
  return PAGE_SIZES.includes(n) ? n : DEFAULT_PAGE_SIZE;
}

// `total` may be unknown yet (still loading), so clamping to the last page
// only happens once we actually know how many pages exist.
export function parsePage(raw, { pageSize, total }) {
  const requested = parsePositiveInt(raw, 1);
  if (total == null) return requested;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(requested, lastPage);
}

export function skipFor(page, pageSize) {
  return (page - 1) * pageSize;
}
