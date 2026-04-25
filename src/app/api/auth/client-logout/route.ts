import { NextResponse } from "next/server";
import { revokeClientAccessToken } from "@/lib/clients";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const tokenMatch = cookie.match(/opint_client_access=([^;]+)/);
  const token = tokenMatch?.[1];

  if (token) {
    await revokeClientAccessToken(token);
    await logAuditEvent("CLIENT_LOGOUT", null, "client", { timestamp: new Date().toISOString() });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("opint_client_access", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/client",
    maxAge: 0,
  });
  return response;
}