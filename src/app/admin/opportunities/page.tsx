import { PageShell } from "@/components/page-shell";
import type { DeliveryEventRecord, OpportunityRecord, ReviewTaskRecord } from "@/lib/types";
import { supabaseSelect } from "@/lib/supabase-rest";
import { OpportunityActions } from "./opportunity-actions";

export default async function AdminOpportunitiesPage() {
  const opportunities = await supabaseSelect<OpportunityRecord>("opportunities", { order: "created_at.desc", limit: "50" });
  const reviewTasks = await supabaseSelect<ReviewTaskRecord>("review_tasks", { limit: "500" });
  const deliveryEvents = await supabaseSelect<DeliveryEventRecord>("delivery_events", { limit: "500" });

  const reviewByOpportunity = new Map(reviewTasks.map((task) => [task.opportunity_id, task.status]));
  const deliveryCount = new Map<string, number>();
  for (const event of deliveryEvents) {
    deliveryCount.set(event.opportunity_id, (deliveryCount.get(event.opportunity_id) ?? 0) + 1);
  }

  return (
    <PageShell title="Admin Opportunities" subtitle="Latest ingested opportunities from the live backend.">
      <div className="grid gap-4">
        {opportunities.map((opportunity) => (
          <article key={opportunity.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{opportunity.title}</h2>
                <p className="mt-1 text-sm text-slate-300">{opportunity.company_name ?? "Unknown company"} · {opportunity.location ?? "Unknown location"}</p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>Quality: {opportunity.quality_score}</p>
                <p>Freshness: {opportunity.freshness_score}</p>
                <p>Review: {reviewByOpportunity.get(opportunity.id) ?? "none"}</p>
                <p>Deliveries: {deliveryCount.get(opportunity.id) ?? 0}</p>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-slate-300">{opportunity.description ?? "No description available."}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-300">
              {(opportunity.skills ?? []).slice(0, 8).map((skill) => (
                <span key={skill} className="rounded-full border border-cyan-700 px-2 py-1">{skill}</span>
              ))}
            </div>
            <OpportunityActions opportunityId={opportunity.id} />
          </article>
        ))}
      </div>
    </PageShell>
  );
}
