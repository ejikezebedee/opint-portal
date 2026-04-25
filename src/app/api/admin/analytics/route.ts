import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase-rest";
import type {
  ClientRecord,
  DeliveryEventRecord,
  OpportunityRecord,
  ProjectRecord,
  ReviewTaskRecord,
  SourceRecord,
} from "@/lib/types";

export async function GET() {
  try {
    const [sources, opportunities, reviews, deliveries, clients, projects] = await Promise.all([
      supabaseSelect<SourceRecord>("sources", { limit: "500" }),
      supabaseSelect<OpportunityRecord>("opportunities", { limit: "2000" }),
      supabaseSelect<ReviewTaskRecord>("review_tasks", { limit: "2000" }),
      supabaseSelect<DeliveryEventRecord>("delivery_events", { limit: "2000" }),
      supabaseSelect<ClientRecord>("clients", { limit: "500" }),
      supabaseSelect<ProjectRecord>("projects", { limit: "500" }),
    ]);

    const sourceStats = sources.map((source) => {
      const sourceOpportunities = opportunities.filter((opp) => opp.source_id === source.id);
      const avgQuality = sourceOpportunities.length
        ? sourceOpportunities.reduce((sum, opp) => sum + (opp.quality_score ?? 0), 0) / sourceOpportunities.length
        : 0;
      return {
        id: source.id,
        name: source.name,
        type: source.type,
        last_run_at: source.last_run_at,
        opportunities: sourceOpportunities.length,
        avg_quality: Number(avgQuality.toFixed(2)),
      };
    });

    const reviewStats = {
      total: reviews.length,
      approved: reviews.filter((item) => item.status === "approved").length,
      rejected: reviews.filter((item) => item.status === "rejected").length,
      pending: reviews.filter((item) => item.status === "pending").length,
    };

    const clientStats = clients.map((client) => {
      const ownedProjects = projects.filter((project) => project.client_id === client.id);
      const projectIds = new Set(ownedProjects.map((project) => project.id));
      const ownedDeliveries = deliveries.filter((delivery) => projectIds.has(delivery.project_id));
      return {
        id: client.id,
        name: client.name,
        projects: ownedProjects.length,
        deliveries: ownedDeliveries.length,
      };
    });

    const projectStats = projects.map((project) => ({
      id: project.id,
      name: project.name,
      client_id: project.client_id,
      deliveries: deliveries.filter((delivery) => delivery.project_id === project.id).length,
    }));

    return NextResponse.json({
      sourceStats,
      reviewStats,
      clientStats,
      projectStats,
      totals: {
        sources: sources.length,
        opportunities: opportunities.length,
        reviews: reviews.length,
        deliveries: deliveries.length,
        clients: clients.length,
        projects: projects.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
