import { NextResponse } from "next/server";
import { supabaseInsert, supabaseSelect } from "@/lib/supabase-rest";
import type { SourceRecord } from "@/lib/types";

export async function GET() {
  try {
    const sources = await supabaseSelect<SourceRecord>("sources", { order: "created_at.desc" });
    return NextResponse.json({ sources });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "name and type are required" }, { status: 400 });
    }

    const inserted = await supabaseInsert<SourceRecord>("sources", {
      name: body.name,
      type: body.type,
      config: body.config ?? {},
      is_active: body.is_active ?? true,
    });

    return NextResponse.json({ source: inserted[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
