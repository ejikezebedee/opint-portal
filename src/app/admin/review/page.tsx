import { PageShell } from "@/components/page-shell";
import type { OpportunityRecord, ReviewTaskRecord } from "@/lib/types";
import { supabaseSelect } from "@/lib/supabase-rest";
import { ReviewActions } from "./review-actions";

export default async function AdminReviewPage() {
  const reviewTasks = await supabaseSelect<ReviewTaskRecord>("review_tasks", { order: "created_at.desc", limit: "50" });
  const opportunities = await supabaseSelect<OpportunityRecord>("opportunities", { limit: "500" });
  const opportunityMap = new Map(opportunities.map((item) => [item.id, item]));

  return (
    <PageShell title="Review Queue" subtitle="Human approval queue for low-confidence opportunities.">
      <div className="grid gap-4">
        {reviewTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-slate-400">No review tasks yet.</div>
        ) : (
          reviewTasks.map((task) => {
            const opportunity = opportunityMap.get(task.opportunity_id);
            return (
              <article key={task.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{opportunity?.title ?? `Task ${task.id}`}</h2>
                    <p className="text-sm text-slate-300">Opportunity: {task.opportunity_id}</p>
                  </div>
                  <span className="rounded-full border border-amber-500 px-3 py-1 text-xs text-amber-300">{task.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Notes: {task.reviewer_notes ?? "None"}</p>
                <p className="mt-1 text-sm text-slate-400">Reason: {task.decision_reason ?? "None"}</p>
                <ReviewActions reviewTaskId={task.id} />
              </article>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
