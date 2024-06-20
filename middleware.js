import { NextResponse } from "next/server";
import Cookies from "js-cookie"; // Import js-cookie
import jwtDecode from "jwt-decode";

export function middleware(req) {
  const cookie = req.cookies.get("token")?.value;
  const decodedToken = cookie ? jwtDecode(cookie) : null;
  const currentTime = Math.floor(Date.now() / 1000);

  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/konsultasi") ||
    req.nextUrl.pathname.startsWith("/topik") ||
    req.nextUrl.pathname.startsWith("/materi")
  ) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (decodedToken.exp < currentTime) {
      // Token has expired, perform logout and redirect to login
      Cookies.remove("token"); // Remove token from cookies
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