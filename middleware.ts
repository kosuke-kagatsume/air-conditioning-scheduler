import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  // 認証APIとその他の公開APIは除外
  const publicPaths = [
    '/api/auth',
    '/api/test',
    '/login',
    '/register',
  ];
  
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));
  
  // Supabaseセッション更新
  const response = await updateSession(req);
  
  if (isPublicPath) {
    return response;
  }
  
  // デモモードチェック（既存機能維持）
  const ok = req.cookies.get("demo")?.value === "1";
  if (!ok && (req.nextUrl.pathname.startsWith("/schedule") || req.nextUrl.pathname.startsWith("/api"))) {
    const url = req.nextUrl.clone(); 
    url.pathname = "/login/demo";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = { 
  matcher: ["/schedule/:path*", "/api/:path*"] 
};