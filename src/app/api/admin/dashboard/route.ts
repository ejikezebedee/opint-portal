import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { DeliveryEventRecord, OpportunityRecord, ProjectRecord, ReviewTaskRecord, SourceRecord } from "@/lib/types";

export async function GET() {
  try {
    const [sources, opportunities, reviewTasks, deliveryEvents, projects] = await Promise.all([
      supabaseSelect<SourceRecord>("sources", { limit: "200" }),
      supabaseSelect<OpportunityRecord>("opportunities", { limit: "500" }),
      supabaseSelect<ReviewTaskRecord>("review_tasks", { limit: "500" }),
      supabaseSelect<DeliveryEventRecord>("delivery_events", { limit: "500" }),
      supabaseSelect<ProjectRecord>("projects", { limit: "200" }),
    ]);

    return NextResponse.json({
      metrics: {
        sources: sources.length,
        opportunities: opportunities.length,
        reviewTasks: reviewTasks.length,
        deliveryEvents: deliveryEvents.length,
        projects: projects.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
