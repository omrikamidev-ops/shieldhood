import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/api/locations", "/api/settings", "/api/revalidate"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (!needsAuth) return NextResponse.next();

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new NextResponse("Admin password not configured", { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString();
    const [, password] = credentials.split(":");

    if (password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/locations/:path*", "/api/settings/:path*", "/api/revalidate"],
};
