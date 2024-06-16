import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const decodedToken = token && jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);

  const restrictedPaths = new Set([
    "/dashboard",
    "/admin",
    "/konsultasi",
    "/topik",
    "/materi",
  ]);

  if (restrictedPaths.has(request.nextUrl.pathname.split("/")[1])) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (decodedToken?.exp < currentTime) {
      request.cookies.delete("token");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = decodedToken?.role;
    const restrictedPages = {
      admin: new Set(["/user", "/psikolog"]),
      user: new Set(["/admin", "/psikolog"]),
      psikolog: new Set(["/admin", "/user"]),
    };

    const restrictedPage = restrictedPages[userRole];
    if (
      restrictedPage &&
      restrictedPage.has(request.nextUrl.pathname.split("/")[2])
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}
