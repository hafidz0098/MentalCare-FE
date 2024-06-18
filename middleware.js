import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";

export function middleware(req) {
  const cookie = req.cookies.get("token")?.value;
  const decodedToken = cookie ? jwtDecode(cookie) : null;
  const currentTime = Math.floor(Date.now() / 1000);

  // List of protected paths
  const protectedPaths = [
    "/dashboard",
    "/admin",
    "/konsultasi",
    "/topik",
    "/materi",
  ];

  // Check if the request path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // If no cookie is found, redirect to login
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token is expired, redirect to login
    if (decodedToken.exp < currentTime) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Restrict access based on role
    const userRole = decodedToken.role;
    if (
      (userRole === "admin" &&
        (req.nextUrl.pathname.startsWith("/dashboard/user") ||
          req.nextUrl.pathname.startsWith("/dashboard/psikolog"))) ||
      (userRole === "user" &&
        (req.nextUrl.pathname.startsWith("/dashboard/admin") ||
          req.nextUrl.pathname.startsWith("/dashboard/psikolog"))) ||
      (userRole === "psikolog" &&
        (req.nextUrl.pathname.startsWith("/dashboard/admin") ||
          req.nextUrl.pathname.startsWith("/dashboard/user")))
    ) {
      // Redirect to a general dashboard or an appropriate page
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
