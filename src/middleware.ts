import { auth } from "@/auth";

const ROOT = "/signin";
const DEFAULT_REDIRECT = "/jagratama";
const PUBLIC_ROUTES = [
  "/signin",
]
const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  "/jagratama": ["admin", "requester", "approver", "reviewer"],
  "/jagratama/users": ["admin"],
  "/jagratama/documents": ["requester"],
  "/jagratama/actions": ["approver", "reviewer"],
};

// Protect routes
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user.role || "guest"; // Default to 'guest' if no role is found

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // Redirect logged in users away from public routes
  if (isPublicRoute && isAuthenticated) return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  // Block unauthenticated users from private routes
  if (!isAuthenticated && !isPublicRoute) return Response.redirect(new URL(ROOT, nextUrl));

  // 🔐 Role-Based Route Protection
  for (const routePrefix in ROLE_ROUTE_ACCESS) {
    if (pathname.startsWith(routePrefix)) {
      const allowedRoles = ROLE_ROUTE_ACCESS[routePrefix];
      if (!allowedRoles.includes(userRole)) {
        return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
      }
    }
  }

  if (pathname === "/") {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }
})

// This tells which routes to protect
export const config = {
  matcher: [
    "/jagratama/:path*",
    "/signin",
    "/",
  ],
};

