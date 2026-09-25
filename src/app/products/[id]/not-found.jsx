import Link from "next/link";

// Rendered automatically by Next.js when a Server Component in this route
// calls the notFound() function. Our page is a Client Component, though
// (it needs hooks), so we also render this same UI manually for the 404
// case coming back from useProduct -- see page.jsx.
export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
      <p className="mt-2 text-slate-600">We couldn&apos;t find a product with that id.</p>
      <Link
        href="/products"
        className="mt-6 inline-block rounded-md bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800"
      >
        Back to products
      </Link>
    </div>
  );
}
