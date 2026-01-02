import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/api/locations", "/api/settings", "/api/revalidate"];

// Pure JavaScript base64 decode - works in Edge Runtime
function base64Decode(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;
  
  str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
  while (i < str.length) {
    const enc1 = chars.indexOf(str.charAt(i++));
    const enc2 = chars.indexOf(str.charAt(i++));
    const enc3 = chars.indexOf(str.charAt(i++));
    const enc4 = chars.indexOf(str.charAt(i++));
    
    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    
    output += String.fromCharCode(chr1);
    
    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }
  
  return output;
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
