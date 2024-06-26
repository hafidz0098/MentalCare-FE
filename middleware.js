import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";

export function middleware(req) {
  const { pathname } = req.nextUrl || {};
  const { cookies } = req || {};
  const token = cookies?.get("token")?.value;
  const currentTime = Math.floor(Date.now() / 1000);

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/konsultasi") ||
    pathname?.startsWith("/topik") ||
    pathname?.startsWith("/materi")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp < currentTime) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const userRole = decodedToken.role;
      const restrictedPaths = {
        admin: ["/dashboard/user", "/dashboard/psikolog"],
        user: ["/dashboard/admin", "/dashboard/psikolog"],
        psikolog: ["/dashboard/admin", "/dashboard/user"],
      };

      if (restrictedPaths[userRole]?.some(path => pathname?.startsWith(path))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
