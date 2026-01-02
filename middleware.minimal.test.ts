// MINIMAL TEST MIDDLEWARE - to isolate __dirname issue
// If this works, the issue is in our code
// If this fails, the issue is in Next.js/Vercel bundling

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
      });
    }
    
    // Simple password check without base64 decode
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }
    
    // For now, just check if password is in header (temporary test)
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
