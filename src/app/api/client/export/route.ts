import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { DeliveryEventRecord, OpportunityRecord } from "@/lib/types";

function toCsv(rows: OpportunityRecord[]) {
  const headers = ["id", "title", "company_name", "location", "url", "quality_score", "freshness_score"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push([
      row.id,
      row.title,
      row.company_name ?? "",
      row.location ?? "",
      row.url ?? "",
      String(row.quality_score),
      String(row.freshness_score),
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
  }
  return lines.join("\n");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const events = await supabaseSelect<DeliveryEventRecord>("delivery_events", {
      project_id: `eq.${projectId}`,
      order: "created_at.desc",
      limit: "100",
    });

    const opportunities: OpportunityRecord[] = [];
    for (const event of events) {
      const rows = await supabaseSelect<OpportunityRecord>("opportunities", {
        id: `eq.${event.opportunity_id}`,
        limit: "1",
      });
      if (rows[0]) opportunities.push(rows[0]);
    }

    const csv = toCsv(opportunities);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="project-${projectId}-opportunities.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
