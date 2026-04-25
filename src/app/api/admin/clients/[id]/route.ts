import { NextResponse } from "next/server";
import { supabasePatch, supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord } from "@/lib/types";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const rows = await supabaseSelect<ClientRecord>("clients", { id: `eq.${id}`, limit: "1" });
    return NextResponse.json({ client: rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const rows = await supabasePatch<ClientRecord>(
      "clients",
      { id: `eq.${id}` },
      {
        name: body.name,
        email: body.email ?? null,
        company: body.company ?? null,
        status: body.status ?? "active",
        updated_at: new Date().toISOString(),
      },
    );
    return NextResponse.json({ client: rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
