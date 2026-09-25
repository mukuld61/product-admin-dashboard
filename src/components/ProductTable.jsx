import { formatCategory, formatPrice, formatStock } from "@/lib/format";

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
            <tr key={p.id}>
              <td className="px-4 py-2">
                {/* Plain <img>: keeps setup simple (next/image needs extra config for external hosts) */}
                <img src={p.thumbnail} alt={p.title} width={48} height={48} loading="lazy" className="h-12 w-12 rounded-md bg-slate-100 object-cover" />
              </td>
              <td className="px-4 py-2 font-medium text-slate-900">{p.title}</td>
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
