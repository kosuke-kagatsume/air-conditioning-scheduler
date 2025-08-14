import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const ok = req.cookies.get("demo")?.value === "1";
  if (!ok && (req.nextUrl.pathname.startsWith("/schedule") || req.nextUrl.pathname.startsWith("/api"))) {
    const url = req.nextUrl.clone(); 
    url.pathname = "/login/demo";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { 
  matcher: ["/schedule/:path*", "/api/:path*"] 
};