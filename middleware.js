import { NextResponse } from "next/server";
import Cookies from "js-cookie"; // Import js-cookie
import jwtDecode from "jwt-decode";

export function middleware(req) {
  const cookie = req.cookies.get("token")?.value;
  const decodedToken = cookie ? jwtDecode(cookie) : null;
  const currentTime = Math.floor(Date.now() / 1000);

  let response;

  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    // req.nextUrl.pathname.startsWith("/konsultasi") ||
    // req.nextUrl.pathname.startsWith("/topik") ||
    req.nextUrl.pathname.startsWith("/materi")
  ) {
    if (!cookie) {
      response = NextResponse.redirect(new URL("/login", req.url));
      response.headers.set('ngrok-skip-browser-warning', 'true');
      return response;
    }

    if (decodedToken.exp < currentTime) {
      // Token has expired, perform logout and redirect to login
      Cookies.remove("token"); // Remove token from cookies
      response = NextResponse.redirect(new URL("/login", req.url));
      response.headers.set('ngrok-skip-browser-warning', 'true');
      return response;
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
      response = NextResponse.redirect(new URL("/dashboard", req.url));
      response.headers.set('ngrok-skip-browser-warning', 'true');
      return response;
    }
  }

  response = NextResponse.next();
  return response;
}