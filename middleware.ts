import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // 認証APIとその他の公開APIは除外
  const publicPaths = [
    '/api/auth',
    '/api/test',
  ];
  
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
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