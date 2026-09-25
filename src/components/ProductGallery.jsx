"use client";

import { useState } from "react";

export default function ProductGallery({ images, title }) {
  const list = images && images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (list.length === 0) {
    return <div className="aspect-square rounded-lg bg-slate-100" />;
  }

  return (
    <div>
      <img
        src={list[active]}
        alt={title}
        className="aspect-square w-full rounded-lg bg-slate-100 object-cover"
      />
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 ${
                i === active ? "border-teal-700" : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
