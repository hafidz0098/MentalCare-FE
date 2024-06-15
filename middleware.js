import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const decodedToken = token ? jwtDecode(token) : null;
  const currentTime = Math.floor(Date.now() / 1000);

  const restrictedPaths = [
    "/dashboard",
    "/admin",
    "/konsultasi",
    "/topik",
    "/materi",
  ];

  if (
    restrictedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (decodedToken && decodedToken.exp < currentTime) {
      request.cookies.delete("token");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = decodedToken?.role;
    const restrictedPages = {
      admin: ["/dashboard/user", "/dashboard/psikolog"],
      user: ["/dashboard/admin", "/dashboard/psikolog"],
      psikolog: ["/dashboard/admin", "/dashboard/user"],
    };

    const restrictedPage = restrictedPages[userRole];
    if (
      restrictedPage &&
      restrictedPage.some((path) => request.nextUrl.pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}
