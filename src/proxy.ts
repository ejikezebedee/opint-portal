import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION = "opint_portal_session";
const CLIENT_SESSION = "opint_client_access";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isClientRoute = pathname.startsWith("/client") || pathname.startsWith("/api/client");
  const isLogin = pathname.startsWith("/login") || pathname.startsWith("/client/login");

  if (isLogin) {
    return NextResponse.next();
  }

  if (isAdminRoute) {
    const adminCookie = request.cookies.get(ADMIN_SESSION)?.value;
    if (adminCookie === "authenticated") {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isClientRoute) {
    const clientToken = request.cookies.get(CLIENT_SESSION)?.value;
    if (clientToken) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/client/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/api/admin/:path*", "/api/client/:path*"],
};
