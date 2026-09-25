"use client";

import { PAGE_SIZES } from "@/lib/pagination";

// Renders up to 5 page number buttons centered on the current page,
// e.g. on page 7 of 20: 5 6 [7] 8 9.
function pageNumbers(current, lastPage) {
  const windowSize = 5;
  let start = Math.max(1, current - 2);
  let end = Math.min(lastPage, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const buttonClass = (active) =>
    `min-w-[2.25rem] rounded-md px-2.5 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
      active ? "bg-teal-700 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing {from}-{to} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          Per page
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            className={buttonClass(false)}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>

          {pageNumbers(page, lastPage).map((n) => (
            <button
              key={n}
              aria-current={n === page ? "page" : undefined}
              className={buttonClass(n === page)}
              onClick={() => onPageChange(n)}
            >
              {n}
            </button>
          ))}

          <button
            className={buttonClass(false)}
            disabled={page >= lastPage}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
