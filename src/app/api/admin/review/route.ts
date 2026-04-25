import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { ReviewTaskRecord } from "@/lib/types";

export async function GET() {
  try {
    const reviewTasks = await supabaseSelect<ReviewTaskRecord>("review_tasks", { order: "created_at.desc", limit: "50" });
    return NextResponse.json({ reviewTasks });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
