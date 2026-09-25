import Link from "next/link";
import { formatCategory, formatPrice, formatStock } from "@/lib/format";

function Thumbnail({ src, alt }) {
  // Same reasoning as ProductTable.jsx: an <img src=""> re-requests the
  // current page, so a locally-added product with no thumbnail gets a
  // plain placeholder box instead.
  if (!src) {
    return <div className="h-[72px] w-[72px] shrink-0 rounded-md bg-slate-100" aria-hidden="true" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      width={72}
      height={72}
      loading="lazy"
      className="h-[72px] w-[72px] shrink-0 rounded-md bg-slate-100 object-cover"
    />
  );
}

// Mobile view (hidden from the md breakpoint up)
export default function ProductCards({ products }) {
  return (
    <ul className="grid gap-3 md:hidden">
      {products.map((p) => (
        <li key={p.id}>
          <Link
            href={`/products/${p.id}`}
            className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
          >
            <Thumbnail src={p.thumbnail} alt={p.title} />
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{p.title}</p>
              <p className="text-sm capitalize text-slate-600">{formatCategory(p.category)}</p>
              <p className="mt-1 text-sm text-slate-900">
                {formatPrice(p.price)} <span className="text-slate-500">| {p.rating.toFixed(1)} rating</span>
              </p>
              <p className="text-sm text-slate-600">{formatStock(p.stock)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
