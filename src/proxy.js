import { NextResponse } from "next/server";

// Runs on the server before a page renders: first gate for protected routes.
export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/products", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/products/:path*"],
};
