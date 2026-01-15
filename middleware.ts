import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashPassword, isValidAdminCookie } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path needs authentication
  const isAdmin = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout");
  const isProtectedApi =
    pathname.startsWith("/api/locations") ||
    pathname.startsWith("/api/local-pages") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/revalidate");

  if (!isAdmin && !isProtectedApi) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Check for admin password
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin password not configured" },
      { status: 500 }
    );
  }

  const cookieValue = request.cookies.get("admin_auth")?.value || "";
  const expectedHash = await hashPassword(adminPassword);
  const isAuthed = isValidAdminCookie(cookieValue, expectedHash);
  if (isAuthed) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/locations",
    "/api/locations/:path*",
    "/api/local-pages",
    "/api/local-pages/:path*",
    "/api/settings",
    "/api/settings/:path*",
    "/api/revalidate",
    "/api/revalidate/:path*",
  ],
};
