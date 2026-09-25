"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

// Second gate (the proxy is the first): covers the case where the cookie
// disappears while the page is open, e.g. logout in another tab.
export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  return children;
}
