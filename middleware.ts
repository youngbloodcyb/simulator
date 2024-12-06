import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the cookie
  const loginCookie = request.cookies.get("call_sim_login")?.value;

  // Check if we're already on the login page
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Verify the cookie by comparing it with hashed password
  const isValidCookie =
    loginCookie === Buffer.from(process.env.PASSWORD!).toString("base64");

  // If we're not on the login page and the cookie is invalid, redirect to login
  if (!isLoginPage && !isValidCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If we're on login page and have valid cookie, redirect to home
  if (isLoginPage && isValidCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
