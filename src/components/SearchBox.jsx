"use client";

export default function SearchBox({ value, onChange }) {
  return (
    <label className="block">
      <span className="sr-only">Search products</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 sm:w-72"
      />
    </label>
  );
}
