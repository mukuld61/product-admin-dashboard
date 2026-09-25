import Link from "next/link";
import { formatCategory, formatPrice, formatStock } from "@/lib/format";

function Thumbnail({ src, alt }) {
  // A locally-added product (step 8) can have an empty thumbnail, since the
  // field is optional. An <img src=""> re-requests the current page, so we
  // render a plain placeholder box instead when there's no URL.
  if (!src) {
    return <div className="h-12 w-12 rounded-md bg-slate-100" aria-hidden="true" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      width={48}
      height={48}
      loading="lazy"
      className="h-12 w-12 rounded-md bg-slate-100 object-cover"
    />
  );
}

// Desktop view (hidden below the md breakpoint)
export default function ProductTable({ products }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Price</th>
            <th className="px-4 py-3 text-right font-medium">Rating</th>
            <th className="px-4 py-3 text-right font-medium">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="px-4 py-2">
                <Link href={`/products/${p.id}`}>
                  {/* Plain <img>: keeps setup simple (next/image needs extra config for external hosts) */}
                  <Thumbnail src={p.thumbnail} alt={p.title} />
                </Link>
              </td>
              <td className="px-4 py-2 font-medium text-slate-900">
                <Link href={`/products/${p.id}`} className="hover:text-teal-700 hover:underline">
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-2 capitalize text-slate-700">{formatCategory(p.category)}</td>
              <td className="px-4 py-2 text-right text-slate-900">{formatPrice(p.price)}</td>
              <td className="px-4 py-2 text-right text-slate-700">{p.rating.toFixed(1)}</td>
              <td className="px-4 py-2 text-right text-slate-700">{formatStock(p.stock)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
