"use client";

export default function CategorySelect({ categories, value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      Category
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-2 capitalize focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c} className="capitalize">
            {c.replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
