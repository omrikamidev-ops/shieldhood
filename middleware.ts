// MINIMAL MIDDLEWARE TEST - to isolate __dirname issue
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Absolute minimal middleware - just pass through
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
