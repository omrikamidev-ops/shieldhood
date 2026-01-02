import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/api/locations", "/api/settings", "/api/revalidate"];

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));

    if (!needsAuth) return NextResponse.next();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return new NextResponse("Admin password not configured. Please set ADMIN_PASSWORD in Vercel environment variables.", { 
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Basic ")) {
      try {
        const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString();
        const [, password] = credentials.split(":");

        if (password === adminPassword) {
          return NextResponse.next();
        }
      } catch (error) {
        console.error("Failed to parse Basic Auth credentials:", error);
      }
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
    });
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/locations/:path*", "/api/settings/:path*", "/api/revalidate"],
};
