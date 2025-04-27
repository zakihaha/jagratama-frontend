import { auth } from "@/auth";

const ROOT = "/signin";
const DEFAULT_REDIRECT = "/jagratama";
const PUBLIC_ROUTES = [
  "/signin",
]

// Protect routes
export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL(ROOT, nextUrl));
})

// This tells which routes to protect
export const config = {
  matcher: [
    "/jagratama/:path*",
    "/signin",
  ],
};

