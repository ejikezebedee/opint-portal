import { NextResponse } from "next/server";
import { getSessionCookieName, verifyPassword } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body.password;
    if (!password || !verifyPassword(password)) {
      await logAuditEvent("LOGIN_FAILED", null, null, { reason: "Invalid credentials" });
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(getSessionCookieName(), "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    await logAuditEvent("LOGIN_SUCCESS", null, "admin", { timestamp: new Date().toISOString() });
    return response;
  } catch (error) {
    await logAuditEvent("LOGIN_ERROR", null, null, { reason: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}