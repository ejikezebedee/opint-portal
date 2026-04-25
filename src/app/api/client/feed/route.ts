import { NextResponse } from "next/server";
import { getClientAccessToken, generateClientAccessToken } from "@/lib/clients";
import { supabaseSelect } from "@/lib/supabase-rest";
import type { ClientRecord, DeliveryEventRecord, OpportunityRecord, ProjectRecord } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedProjectId = searchParams.get("projectId");

    if (!requestedProjectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    let accessToken = await getClientAccessToken(requestedProjectId);
    if (!accessToken) {
      accessToken = await generateClientAccessToken(requestedProjectId);
    }

    const projects = await supabaseSelect<ProjectRecord>("projects", { id: `eq.${requestedProjectId}` });
    const project = projects[0] ?? null;
    const clients = project?.client_id ? await supabaseSelect<ClientRecord>("clients", { id: `eq.${project.client_id}` }) : [];

    const events: DeliveryEventRecord[] = await supabaseSelect<DeliveryEventRecord>("delivery_events", {
      project_id: `eq.${requestedProjectId}`,
      order: "created_at.desc",
      limit: "50",
    });

    const opportunities: OpportunityRecord[] = [];
    for (const event of events) {
      const rows = await supabaseSelect<OpportunityRecord>("opportunities", {
        id: `eq.${event.opportunity_id}`,
        limit: "1",
      });
      if (rows[0]) opportunities.push(rows[0]);
    }

    return NextResponse.json({
      projectId: requestedProjectId,
      access_token: accessToken,
      project,
      client: clients[0] ?? null,
      events,
      opportunities,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}