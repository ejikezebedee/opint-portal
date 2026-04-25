import { NextResponse } from "next/server";
import { getClientAccessRecordByToken, getClientAccessToken, touchClientAccessToken } from "@/lib/clients";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projectId = body.projectId;
    if (!projectId) {
      await logAuditEvent("CLIENT_LOGIN_FAILED", null, null, { reason: "Missing projectId" });
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const token = await getClientAccessToken(projectId);
    const record = await getClientAccessRecordByToken(token);
    if (!record) {
      await logAuditEvent("CLIENT_LOGIN_FAILED", projectId, null, { reason: "Access token not found" });
      return NextResponse.json({ error: "Access token not found" }, { status: 404 });
    }

    await touchClientAccessToken(token);

    const response = NextResponse.json({ ok: true, token, projectId: record.project_id });
    response.cookies.set("opint_client_access", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/client",
      maxAge: 60 * 60 * 24,
    });

    await logAuditEvent("CLIENT_LOGIN_SUCCESS", record.project_id, "client", { timestamp: new Date().toISOString() });
    return response;
  } catch (error) {
    await logAuditEvent("CLIENT_LOGIN_ERROR", null, null, { reason: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}