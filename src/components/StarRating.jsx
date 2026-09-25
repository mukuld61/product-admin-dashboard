// Simple 5-star display, rounded to the nearest half star.
export default function StarRating({ rating }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span aria-label={`${rating} out of 5 stars`} className="inline-flex items-center gap-1 text-amber-500">
      {"\u2605".repeat(Math.floor(rounded))}
      {rounded % 1 !== 0 && "\u00BD"}
      <span className="text-sm text-slate-600">({rating.toFixed(1)})</span>
    </span>
  );
}
