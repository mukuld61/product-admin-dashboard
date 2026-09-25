"use client";

import { useEffect, useState } from "react";

// Returns `value`, but only after it has stopped changing for `delayMs`.
// Typing "shirt" fires this once (with "shirt"), not five times.
export default function useDebouncedValue(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // cancel the pending update if value changes again
  }, [value, delayMs]);

  return debounced;
}
