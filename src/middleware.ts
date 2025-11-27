import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Set to false in production to enable authentication
const BYPASS_AUTH = process.env.NODE_ENV === "development";

export default auth((req) => {
  // Bypass authentication for testing
  if (BYPASS_AUTH) {
    return NextResponse.next();
  }

  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // API routes are handled separately
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  // Static files and Next.js internals
  const isStaticFile =
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.includes(".");

  // Allow static files and API routes
  if (isStaticFile || isApiRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from public routes
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect non-logged-in users to login
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

