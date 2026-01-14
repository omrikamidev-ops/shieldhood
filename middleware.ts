import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pure JavaScript base64 decode - no dependencies, Edge Runtime safe
function decodeBase64(str: string): string {
  if (!str) return "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;
  str = str.replace(/[^A-Za-z0-9+/=]/g, "");
  if (!str) return "";
  while (i < str.length) {
    const enc1 = chars.indexOf(str.charAt(i++));
    const enc2 = i < str.length ? chars.indexOf(str.charAt(i++)) : 64;
    const enc3 = i < str.length ? chars.indexOf(str.charAt(i++)) : 64;
    const enc4 = i < str.length ? chars.indexOf(str.charAt(i++)) : 64;
    if (enc1 === -1 || enc2 === -1) break;
    output += String.fromCharCode((enc1 << 2) | (enc2 >> 4));
    if (enc3 !== 64 && enc3 !== -1) {
      output += String.fromCharCode(((enc2 & 15) << 4) | (enc3 >> 2));
    }
    if (enc4 !== 64 && enc4 !== -1) {
      output += String.fromCharCode(((enc3 & 3) << 6) | enc4);
    }
  }
  return output;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path needs authentication
  const isAdmin = pathname.startsWith("/admin");
  const isProtectedApi = 
    pathname.startsWith("/api/locations") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/revalidate");
  
  if (!isAdmin && !isProtectedApi) {
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

  // Check authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    const base64Credentials = authHeader.substring(6);
    if (base64Credentials) {
      try {
        const credentials = decodeBase64(base64Credentials);
        const parts = credentials.split(":");
        if (parts.length >= 2) {
          const password = parts.slice(1).join(":"); // Handle passwords with colons
          if (password === adminPassword) {
            return NextResponse.next();
          }
        }
      } catch {
        // Invalid format, continue to 401
      }
    }
  }

  // Return 401 Unauthorized
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
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
