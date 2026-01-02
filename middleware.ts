import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/api/locations", "/api/settings", "/api/revalidate"];

// Edge-compatible base64 decode
function base64Decode(str: string): string {
  if (typeof atob !== "undefined") {
    // Browser/Edge Runtime
    return atob(str);
  }
  // Node.js fallback (shouldn't be needed in Edge Runtime)
  return Buffer.from(str, "base64").toString();
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));

    if (!needsAuth) return NextResponse.next();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return new NextResponse("Admin password not configured. Please set ADMIN_PASSWORD in Vercel environment variables.", { 
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Basic ")) {
      try {
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = base64Decode(base64Credentials);
        const [, password] = credentials.split(":");

        if (password === adminPassword) {
          return NextResponse.next();
        }
      } catch (error) {
        // Invalid credentials format, continue to 401
      }
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
    });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/locations/:path*",
    "/api/settings/:path*",
    "/api/revalidate/:path*",
  ],
};
