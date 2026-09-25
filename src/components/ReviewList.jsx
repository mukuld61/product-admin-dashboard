import StarRating from "./StarRating";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-slate-600">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((r, i) => (
        <li key={i} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">{r.reviewerName}</span>
            <StarRating rating={r.rating} />
          </div>
          <p className="mt-2 text-sm text-slate-700">{r.comment}</p>
          <p className="mt-1 text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
