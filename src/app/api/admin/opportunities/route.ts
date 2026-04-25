import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { OpportunityRecord } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ?? "50";
    const opportunities = await supabaseSelect<OpportunityRecord>("opportunities", {
      order: "created_at.desc",
      limit,
    });

    return NextResponse.json({ opportunities });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
