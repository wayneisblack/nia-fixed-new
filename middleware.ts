import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

// Deliberately built from authConfig alone (no providers, no MongoDB, no
// bcrypt) so this stays compatible with the Edge Runtime middleware runs on.
// Importing the full auth.ts here would silently break every route this
// matcher covers, since the Node-only MongoDB driver can't run at the edge.
const { auth } = NextAuth(authConfig);

function matchesProtected(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/account") ||
    /^\/opportunities\/[^/]+\/apply/.test(pathname)
  );
}

export default auth((request) => {
  const { pathname, search } = request.nextUrl;

  if (!matchesProtected(pathname)) return NextResponse.next();
  if (request.auth?.user) return NextResponse.next();

  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", pathname + search);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/profile/:path*", "/account/:path*", "/opportunities/:id/apply"],
};
