import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { DeliveryEventRecord, OpportunityRecord, ProjectRecord, ReviewTaskRecord, SourceRecord } from "@/lib/types";

export async function GET() {
  try {
    const [sources, opportunities, reviewTasks, deliveryEvents, projects] = await Promise.all([
      supabaseSelect<SourceRecord>("sources", { order: "created_at.desc", limit: "5" }),
      supabaseSelect<OpportunityRecord>("opportunities", { order: "created_at.desc", limit: "5" }),
      supabaseSelect<ReviewTaskRecord>("review_tasks", { order: "created_at.desc", limit: "5" }),
      supabaseSelect<DeliveryEventRecord>("delivery_events", { order: "created_at.desc", limit: "5" }),
      supabaseSelect<ProjectRecord>("projects", { order: "created_at.desc", limit: "5" }),
    ]);

    return NextResponse.json({ sources, opportunities, reviewTasks, deliveryEvents, projects });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
