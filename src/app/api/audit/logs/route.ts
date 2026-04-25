import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { AuditLogRecord } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ?? "50";
    const logs = await supabaseSelect<AuditLogRecord>("audit_logs", { order: "created_at.desc", limit });
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}