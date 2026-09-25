export function Loader() {
  return (
    <div role="status" className="flex items-center gap-3 py-16 text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />
      Loading products...
    </div>
  );
}

export function EmptyState({ message }) {
  return <p className="py-16 text-slate-600">{message}</p>;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-medium text-red-800">Could not load products.</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Retry
      </button>
    </div>
  );
}
