import { NextResponse } from "next/server";
import { supabaseInsert, supabaseSelect } from "@/lib/supabase-rest";
import type { ProjectRecord } from "@/lib/types";

export async function GET() {
  try {
    const projects = await supabaseSelect<ProjectRecord>("projects", { order: "created_at.desc" });
    return NextResponse.json({ projects });
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

    const keywords = typeof body.target_keywords === "string"
      ? body.target_keywords.split(",").map((item: string) => item.trim()).filter(Boolean)
      : body.target_keywords ?? [];

    const inserted = await supabaseInsert<ProjectRecord>("projects", {
      name: body.name,
      status: body.status ?? "active",
      target_keywords: keywords,
      client_id: body.client_id ?? null,
      filters: body.filters ?? {},
    });

    return NextResponse.json({ project: inserted[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
