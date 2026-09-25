"use client";

// Encodes sortBy+order as one value ("price-asc") so it's a single <select>.
const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
];

export default function SortSelect({ sortBy, order, onChange }) {
  const current = sortBy ? `${sortBy}-${order}` : "";

  function handleChange(e) {
    const val = e.target.value;
    if (!val) return onChange({ sortBy: "", order: "" });
    const [nextSortBy, nextOrder] = val.split("-");
    onChange({ sortBy: nextSortBy, order: nextOrder });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      Sort by
      <select
        value={current}
        onChange={handleChange}
        className="rounded-md border border-slate-300 bg-white px-2 py-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
