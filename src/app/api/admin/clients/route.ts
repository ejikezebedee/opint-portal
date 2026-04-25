import { NextResponse } from "next/server";
import { supabaseInsert, supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord } from "@/lib/types";

export async function GET() {
  try {
    const clients = await supabaseSelect<ClientRecord>("clients", { order: "created_at.desc" });
    return NextResponse.json({ clients });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const inserted = await supabaseInsert<ClientRecord>("clients", {
      name: body.name,
      email: body.email ?? null,
      company: body.company ?? null,
      status: body.status ?? "active",
    });

    return NextResponse.json({ client: inserted[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
