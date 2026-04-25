import { NextResponse } from "next/server";
import { supabasePatch, supabaseSelect } from "@/lib/supabase-rest";
import type { ProjectRecord } from "@/lib/types";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const rows = await supabaseSelect<ProjectRecord>("projects", { id: `eq.${id}`, limit: "1" });
    return NextResponse.json({ project: rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const rows = await supabasePatch<ProjectRecord>(
      "projects",
      { id: `eq.${id}` },
      {
        name: body.name,
        status: body.status ?? "active",
        target_keywords: body.target_keywords ?? [],
        client_id: body.client_id ?? null,
        filters: body.filters ?? {},
        updated_at: new Date().toISOString(),
      },
    );
    return NextResponse.json({ project: rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
